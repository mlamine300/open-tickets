import { Request, Response } from "express"
import jwt from "jsonwebtoken";
import { TokenPayload } from "../types/index.js";
import ticketModel from "../models/Ticket.js";
import { getFieldsFromFormName, getOrganisationId, getOrganisationsId, getToken } from "../utils/index.js";
import { commentsModel } from "../models/Comment.js";
import mongoose from "mongoose";
import organisationModel from "../models/Organisation.js";
import { io } from "../app.js";
import userModel from "../models/User.js";

const  getPipline=({match,sortField,sortOrder,skip,limit}:{match:any,sortField?:string,sortOrder?:number,skip?:number,limit?:number})=>{
   const msortField = sortField || "createdAt";
    const msortOrder = sortOrder||1;
    const mskip=skip||0;
    const mlimit=limit||10;

    return [
      { $match: match },

      // Join user (creator)
      {
        $lookup: {
          from: "users",
          localField: "creator",
          foreignField: "_id",
          as: "creator"
        }
      },
      { $unwind: { path: "$creator", preserveNullAndEmptyArrays: true } },

      // emitter organization
      {
        $lookup: {
          from: "organisations",
          localField: "emitterOrganizationId",
          foreignField: "_id",
          as: "emitterOrganization"
        }
      },
      { $unwind: { path: "$emitterOrganization", preserveNullAndEmptyArrays: true } },

      // recipient organization
      {
        $lookup: {
          from: "organisations",
          localField: "recipientOrganizationId",
          foreignField: "_id",
          as: "recipientOrganization"
        }
      },
      { $unwind: { path: "$recipientOrganization", preserveNullAndEmptyArrays: true } },

      // associated organizations
      {
        $lookup: {
          from: "organisations",
          localField: "associatedOrganizations",
          foreignField: "_id",
          as: "associatedOrganizations"
        }
      },

      // assignedTo
      {
        $lookup: {
          from: "users",
          localField: "assignedTo.userId",
          foreignField: "_id",
          as: "assignedUsers"
        }
      },

      {
        $addFields: {
          assignedTo: {
            $map: {
              input: {
                $cond: {
                  if: { $isArray: "$assignedTo" },
                  then: "$assignedTo",
                  else: {
                    $cond: {
                      if: { $eq: ["$assignedTo", null] },
                      then: [],
                      else: ["$assignedTo"]
                    }
                  }
                }
              },
              as: "a",
              in: {
                date: "$$a.date",
                user: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$assignedUsers",
                        as: "u",
                        cond: { $eq: ["$$u._id", "$$a.userId"] }
                      }
                    },
                    0
                  ]
                }
              }
            }
          }
        }
      },

      { $project: { assignedUsers: 0 } },

      // Populate lastComment.author (replace authorId with author doc)
      {
        $lookup: {
          from: "users",
          localField: "lastComment.authorId",
          foreignField: "_id",
          as: "lastCommentAuthor"
        }
      },
      {
        $addFields: {
          lastComment: {
            $cond: [
              { $gt: [{ $size: { $ifNull: ["$lastCommentAuthor", []] } }, 0] },
              {
                $mergeObjects: [
                  "$lastComment",
                  { author: { $arrayElemAt: ["$lastCommentAuthor", 0] } }
                ]
              },
              "$lastComment"
            ]
          }
        }
      },
      { $project: { lastCommentAuthor: 0 } },

      // project only necessary fields for creator, organisations and assignedTo
      {
        $project: {
          _id: 1,
          ref: 1,
          formName: 1,
          message: 1,
          status: 1,
          priority: 1,
          createdAt: 1,
          updatedAt: 1,
          specialFields:1,
          attachement:1,
          motif:1,
          lastComment: {
            _id: "$lastComment._id",
            message: "$lastComment.message",
            action: "$lastComment.action",
            ticketRef: "$lastComment.ticketRef",
            createdAt: "$lastComment.createdAt",
            author: { _id: "$lastComment.author._id", name: "$lastComment.author.name", email: "$lastComment.author.email" }
          },
          creator: { _id: "$creator._id", name: "$creator.name", email: "$creator.email" },
          emitterOrganization: { _id: "$emitterOrganization._id", name: "$emitterOrganization.name" },
          recipientOrganization: { _id: "$recipientOrganization._id", name: "$recipientOrganization.name" },
          associatedOrganizations: { $map: { input: { $ifNull: ["$associatedOrganizations", []] }, as: "o", in: { _id: "$$o._id", name: "$$o.name" } } },
          assignedTo: {
            $let: {
              vars: {
                a: { $cond: [{ $isArray: "$assignedTo" }, { $arrayElemAt: ["$assignedTo", 0] }, "$assignedTo"] }
              },
              in: { $cond: [{ $eq: ["$$a", null] }, null, { date: "$$a.date", user: { _id: "$$a.user._id", name: "$$a.user.name", email: "$$a.user.email" } }] }
            }
          }
        }
      },



      // Sorting
      { $sort: { [msortField]: msortOrder } },

      // Pagination + count in one request
      {
        $facet: {
          data: [{ $skip: mskip }, { $limit: mlimit }],
          totalCount: [{ $count: "count" }]
        }
      }
    ];
}




export const addTicket=async(req:Request,res:Response)=>{
   

   
    try {
        //checking auth
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(409).json({ message: "not autorized" });
        const { userId,organisation:emitterOrganizationId,activeStatus } = (await jwt.decode(token)) as TokenPayload;
        if (!userId||!activeStatus) return res.status(409).json({ message: "not autorized" });
        
        //checking request format
        if(!req?.body)return res.status(400).json({message:"there are no fields in request body"})
        const{organisationDest,organisationTag,formName,message,ref}=req.body;
        if(!organisationDest||!formName||!message||!ref){
            return res.status(400).json({message:"fields are required {recipientOrganizationId ,associatedOrganizations ,type and message}"});
        }
        //transform organisation data from name to id
        const recipientOrganizationId=await getOrganisationId(organisationDest as string);
        const associatedOrganizations=(organisationTag&& Array.isArray(organisationTag)&& organisationTag.length)? (await getOrganisationsId(organisationTag) ):[]
        //getting form custom fields and check if request match the form
        const associatedOrganizationsString=associatedOrganizations?.map(assOrg=>assOrg._id.toString()+"")
        const fields=await getFieldsFromFormName(formName);
        const specialFields:any={};
        if(fields!==null){
            const bodyFields=Object.keys(req.body);
            //if there is a required field missing in the request return 400
           for (const f of fields) {
  if (f.required && !bodyFields.includes(f.name)) {
    return res.status(400).json({ message: `${f.name} is required` });
  }
  specialFields[f.name] = req.body[f.name];
}
        }
        
        //
        const priority=req.body?.priority?.toLowerCase()||"low";
        const attachement=req.body?.attachement||"";
         const motif=req.body?.motif||"standart";
        const commentsId:any[]=[];
        
       
       
        const ticket=await ticketModel.create({creator:userId,attachement,motif,
           emitterOrganizationId, recipientOrganizationId,associatedOrganizations:associatedOrganizationsString,
           formName,message,specialFields,priority,commentsId,ref:ref.toUpperCase()
        });
          const comment=await commentsModel.create({
      ticketId:ticket._id,
      authorId:userId,
      action:"create",
      message:"Ticket Créer",
      ticketRef:ticket.ref
    })
    ticket.lastComment=comment;
    ticket.save();


    const pipeline:any = getPipline({
  match: { _id: ticket._id },
  limit: 1,
  skip: 0,
  sortField: "createdAt",
  sortOrder: -1
});

const result = await ticketModel.aggregate(pipeline as any).exec();
const formattedTicket = result[0]?.data?.[0] || null;

io.to(ticket.recipientOrganizationId.toString()).emit('notify', {action:"Ticket Créé",payload:formattedTicket,message:`Vous avez un nouveau ticket (${ticket.motif})`}); 
   
return res.status(200).json({
  message: "success",
  data: formattedTicket
});

      
        // return res.status(200).json({message:"success",data:ticket})

    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"server error"})
    }
}

export const getTickets = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(409).json({ message: "not authorized" });

    const user = jwt.decode(token) as TokenPayload;
    if (!user?.userId) return res.status(409).json({ message: "not authorized" });

    const userId = user.userId;

    // Pagination
    const limit = Number(req.body?.maxPerPage) || 10;
    const page = Number(req.body?.page) || 1;
    const priority=req.body?.priority||null;
    const emitterOrganizationId=req.body?.emitterOrganizationId||null;
     const recipientOrganizationId=req.body?.recipientOrganizationId||null;
     const motif=req.body.motif||null;
     const notag=req.body.notag||null;
    const skip = (page - 1) * limit;


    // Sorting
    const sortField = req.body?.sortField || "createdAt";
    const sortOrder = req.body?.sortOrder === "asc" ? 1 : -1;

    // Search
    const search = req.body?.search || "";


    // Filters
    const type = req.params.type || "pending";
    

    const baseFilter:any = {
      ...getResponsablitiesFilterFromRole(user,notag),
      ...getFilterFromType(type, userId),
      creator: { $ne: new mongoose.Types.ObjectId(userId) },
      emitterOrganizationId:{ $ne: new mongoose.Types.ObjectId(user.organisation) },
    };
if(priority){
  baseFilter["priority"]=priority;
}
if(emitterOrganizationId){
  baseFilter["emitterOrganizationId"]=new mongoose.Types.ObjectId(emitterOrganizationId);
}
if(recipientOrganizationId){
  baseFilter.recipientOrganizationId=new mongoose.Types.ObjectId(recipientOrganizationId);
}
if(motif){
   baseFilter["motif"]=motif;
}
    const searchFilter=getSearchFilter(search)
  const pipeline=getPipline({match:{ ...baseFilter,...searchFilter},limit,skip,sortField,sortOrder})
   

    const result = await ticketModel.aggregate(pipeline as any).exec();

    const data = result[0].data;
    const totalCount = result[0].totalCount[0]?.count || 0;

    return res.status(200).json({
      message: "success",
      data,
      totalCount,
      page,
      maxPerPage: limit
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "server error" });
  }
};

export const searchTickets=async(req:Request,res:Response)=>{
   try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(409).json({ message: "not authorized" });

    const user = jwt.decode(token) as TokenPayload;
    if (!user?.userId) return res.status(409).json({ message: "not authorized" });

    const search = req.body.search || "";
    if(!search||search.length<3)return res.json(200).json({data:[],message:"search less then 3"}) ;

  
   
    const baseFilter:any = {
      ...getResponsablitiesFilterFromRole(user,"false"),
    };

    const searchFilter=getSearchFilter(search.trim())
    const pipeline=getPipline({match: { $and:[searchFilter,baseFilter]},limit:100})
    // const pipeline: any[] = [
    //   { $match: { ...searchFilter
    //     //  ...searchQuery
    //      } },

    //   // Join user (creator)
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "creator",
    //       foreignField: "_id",
    //       as: "creator"
    //     }
    //   },
    //   { $unwind: { path: "$creator", preserveNullAndEmptyArrays: true } },

    //   // emitter organization
    //   {
    //     $lookup: {
    //       from: "organisations",
    //       localField: "emitterOrganizationId",
    //       foreignField: "_id",
    //       as: "emitterOrganization"
    //     }
    //   },
    //   { $unwind: { path: "$emitterOrganization", preserveNullAndEmptyArrays: true } },

    //   // recipient organization
    //   {
    //     $lookup: {
    //       from: "organisations",
    //       localField: "recipientOrganizationId",
    //       foreignField: "_id",
    //       as: "recipientOrganization"
    //     }
    //   },
    //   { $unwind: { path: "$recipientOrganization", preserveNullAndEmptyArrays: true } },

    //   // associated organizations
    //   {
    //     $lookup: {
    //       from: "organisations",
    //       localField: "associatedOrganizations",
    //       foreignField: "_id",
    //       as: "associatedOrganizations"
    //     }
    //   },

    //   // assignedTo
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "assignedTo.userId",
    //       foreignField: "_id",
    //       as: "assignedUsers"
    //     }
    //   },

    //   {
    //     $addFields: {
    //       assignedTo: {
    //         $map: {
    //           input: {
    //             $cond: {
    //               if: { $isArray: "$assignedTo" },
    //               then: "$assignedTo",
    //               else: {
    //                 $cond: {
    //                   if: { $eq: ["$assignedTo", null] },
    //                   then: [],
    //                   else: ["$assignedTo"]
    //                 }
    //               }
    //             }
    //           },
    //           as: "a",
    //           in: {
    //             date: "$$a.date",
    //             user: {
    //               $arrayElemAt: [
    //                 {
    //                   $filter: {
    //                     input: "$assignedUsers",
    //                     as: "u",
    //                     cond: { $eq: ["$$u._id", "$$a.userId"] }
    //                   }
    //                 },
    //                 0
    //               ]
    //             }
    //           }
    //         }
    //       }
    //     }
    //   },

    //   { $project: { assignedUsers: 0 } },

    //   // Populate lastComment.author (replace authorId with author doc)
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "lastComment.authorId",
    //       foreignField: "_id",
    //       as: "lastCommentAuthor"
    //     }
    //   },
    //   {
    //     $addFields: {
    //       lastComment: {
    //         $cond: [
    //           { $gt: [{ $size: { $ifNull: ["$lastCommentAuthor", []] } }, 0] },
    //           {
    //             $mergeObjects: [
    //               "$lastComment",
    //               { author: { $arrayElemAt: ["$lastCommentAuthor", 0] } }
    //             ]
    //           },
    //           "$lastComment"
    //         ]
    //       }
    //     }
    //   },
    //   { $project: { lastCommentAuthor: 0 } },

    //   // project only necessary fields for creator, organisations and assignedTo
    //   {
    //     $project: {
    //       _id: 1,
    //       ref: 1,
    //       formName: 1,
    //       message: 1,
    //       status: 1,
    //       priority: 1,
    //       createdAt: 1,
    //       updatedAt: 1,
    //       specialFields:1,
    //       motif:1,
    //       lastComment: {
    //         _id: "$lastComment._id",
    //         message: "$lastComment.message",
    //         action: "$lastComment.action",
    //         ticketRef: "$lastComment.ticketRef",
    //         createdAt: "$lastComment.createdAt",
    //         author: { _id: "$lastComment.author._id", name: "$lastComment.author.name", email: "$lastComment.author.email" }
    //       },
    //       creator: { _id: "$creator._id", name: "$creator.name", email: "$creator.email" },
    //       emitterOrganization: { _id: "$emitterOrganization._id", name: "$emitterOrganization.name" },
    //       recipientOrganization: { _id: "$recipientOrganization._id", name: "$recipientOrganization.name" },
    //       associatedOrganizations: { $map: { input: { $ifNull: ["$associatedOrganizations", []] }, as: "o", in: { _id: "$$o._id", name: "$$o.name" } } },
    //       assignedTo: {
    //         $let: {
    //           vars: {
    //             a: { $cond: [{ $isArray: "$assignedTo" }, { $arrayElemAt: ["$assignedTo", 0] }, "$assignedTo"] }
    //           },
    //           in: { $cond: [{ $eq: ["$$a", null] }, null, { date: "$$a.date", user: { _id: "$$a.user._id", name: "$$a.user.name", email: "$$a.user.email" } }] }
    //         }
    //       }
    //     }
    //   },



     
    // ];

    const data = await ticketModel.aggregate(pipeline as any[]).exec();
    
    const newData=data.at(0).data;
   
    

    return res.status(200).json({
      message: "success",
      data:newData,
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "server error" });
  }
}


export const getTicketByid=async(req:Request,res:Response)=>{
   try {
//      const token = req.headers.authorization?.split(" ")[1];
// if (!token) return res.status(409).json({ message: "not autorized" });
//     const user = (await jwt.decode(token)) as TokenPayload;
//     const { userId }=user;
//     if (!userId) return res.status(409).json({ message: "not autorized" });
    const id=req.params.id;
    if(!id)return res.status(400).json({message:"id is required"})

    const ticket=await ticketModel.findById(id).populate("emitterOrganizationId").populate("recipientOrganizationId").lean().exec();
    if(!ticket)return res.status(404).json({message:"ticket not found"})
        return res.status(200).json({message:"success",data:{...ticket,emitterOrganization:ticket.emitterOrganizationId,recipientOrganization:ticket.recipientOrganizationId}})
   } catch (error) {
    console.log(error);
    return res.status(500).json({message:"server error",error})
    
   }
}



export const getMytickets = async (req: Request, res: Response) => {

    try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(409).json({ message: "not authorized" });

    const user = jwt.decode(token) as TokenPayload;
    if (!user?.userId) return res.status(409).json({ message: "not authorized" });

    const userId = user.userId;

    // Pagination
    const limit = Number(req.body?.maxPerPage) || 10;
    const page = Number(req.body?.page) || 1;
    const priority=req.body?.priority||null;
     const recipientOrganizationId=req.body?.recipientOrganizationId||null;
    const skip = (page - 1) * limit;
    const status=req.params.status||"pending"
    const motif=req.body.motif||"";
    const notag=req.body.notag||"false";
    // Sorting
    const sortField = req.body?.sortField || "createdAt";
    const sortOrder = req.body?.sortOrder === "asc" ? 1 : -1;

    // Search
    const search = req.body?.search || "";
console.log(JSON.stringify({...getResponsablitiesFilterFromRole(user,notag)}));

    // Filters
    const type = req.params.type || "pending";
    const baseFilter:any = {
      ...getResponsablitiesFilterFromRole(user,notag),
      ...getFilterFromType(type, userId),
      //creator:  new mongoose.Types.ObjectId(userId) 
      emitterOrganizationId: new mongoose.Types.ObjectId(user.organisation) ,
    };
    if(status){
      baseFilter.status=status;
    }

if(priority){
  baseFilter["priority"]=priority;
}
if(motif){
  baseFilter["motif"]=motif;
}

if(recipientOrganizationId){
  baseFilter.recipientOrganizationId=new mongoose.Types.ObjectId(recipientOrganizationId);
}
   
    const searchFilter=getSearchFilter(search)
    const pipeline:any[]=getPipline({match:{...baseFilter,...searchFilter},limit,skip,sortField,sortOrder})
    // const pipeline: any[] = [
    //   { $match: { ...baseFilter,...searchFilter
    //     //  ...searchQuery
    //      } },

    //   // Join user (creator)
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "creator",
    //       foreignField: "_id",
    //       as: "creator"
    //     }
    //   },
    //   { $unwind: { path: "$creator", preserveNullAndEmptyArrays: true } },

    //   // emitter organization
    //   {
    //     $lookup: {
    //       from: "organisations",
    //       localField: "emitterOrganizationId",
    //       foreignField: "_id",
    //       as: "emitterOrganization"
    //     }
    //   },
    //   { $unwind: { path: "$emitterOrganization", preserveNullAndEmptyArrays: true } },

    //   // recipient organization
    //   {
    //     $lookup: {
    //       from: "organisations",
    //       localField: "recipientOrganizationId",
    //       foreignField: "_id",
    //       as: "recipientOrganization"
    //     }
    //   },
    //   { $unwind: { path: "$recipientOrganization", preserveNullAndEmptyArrays: true } },

    //   // associated organizations
    //   {
    //     $lookup: {
    //       from: "organisations",
    //       localField: "associatedOrganizations",
    //       foreignField: "_id",
    //       as: "associatedOrganizations"
    //     }
    //   },

    //   // assignedTo
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "assignedTo.userId",
    //       foreignField: "_id",
    //       as: "assignedUsers"
    //     }
    //   },

    //   {
    //     $addFields: {
    //       assignedTo: {
    //         $map: {
    //           input: {
    //             $cond: {
    //               if: { $isArray: "$assignedTo" },
    //               then: "$assignedTo",
    //               else: {
    //                 $cond: {
    //                   if: { $eq: ["$assignedTo", null] },
    //                   then: [],
    //                   else: ["$assignedTo"]
    //                 }
    //               }
    //             }
    //           },
    //           as: "a",
    //           in: {
    //             date: "$$a.date",
    //             user: {
    //               $arrayElemAt: [
    //                 {
    //                   $filter: {
    //                     input: "$assignedUsers",
    //                     as: "u",
    //                     cond: { $eq: ["$$u._id", "$$a.userId"] }
    //                   }
    //                 },
    //                 0
    //               ]
    //             }
    //           }
    //         }
    //       }
    //     }
    //   },

    //   { $project: { assignedUsers: 0 } },

    //   // Populate lastComment.author (replace authorId with author doc)
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "lastComment.authorId",
    //       foreignField: "_id",
    //       as: "lastCommentAuthor"
    //     }
    //   },
    //   {
    //     $addFields: {
    //       lastComment: {
    //         $cond: [
    //           { $gt: [{ $size: { $ifNull: ["$lastCommentAuthor", []] } }, 0] },
    //           {
    //             $mergeObjects: [
    //               "$lastComment",
    //               { author: { $arrayElemAt: ["$lastCommentAuthor", 0] } }
    //             ]
    //           },
    //           "$lastComment"
    //         ]
    //       }
    //     }
    //   },
    //   { $project: { lastCommentAuthor: 0 } },

    //   // project only necessary fields for creator, organisations and assignedTo
    //   {
    //     $project: {
    //       _id: 1,
    //       ref: 1,
    //       attachement:1,
    //       formName: 1,
    //       message: 1,
    //       status: 1,
    //       priority: 1,
    //       createdAt: 1,
    //       updatedAt: 1,
    //       specialFields:1,
    //        motif:1,
    //       lastComment: {
    //         _id: "$lastComment._id",
    //         message: "$lastComment.message",
    //         action: "$lastComment.action",
    //         ticketRef: "$lastComment.ticketRef",
    //         createdAt: "$lastComment.createdAt",
    //         author: { _id: "$lastComment.author._id", name: "$lastComment.author.name", email: "$lastComment.author.email" }
    //       },
    //       creator: { _id: "$creator._id", name: "$creator.name", email: "$creator.email" },
    //       emitterOrganization: { _id: "$emitterOrganization._id", name: "$emitterOrganization.name" },
    //       recipientOrganization: { _id: "$recipientOrganization._id", name: "$recipientOrganization.name" },
    //       associatedOrganizations: { $map: { input: { $ifNull: ["$associatedOrganizations", []] }, as: "o", in: { _id: "$$o._id", name: "$$o.name" } } },
    //       assignedTo: {
    //         $let: {
    //           vars: {
    //             a: { $cond: [{ $isArray: "$assignedTo" }, { $arrayElemAt: ["$assignedTo", 0] }, "$assignedTo"] }
    //           },
    //           in: { $cond: [{ $eq: ["$$a", null] }, null, { date: "$$a.date", user: { _id: "$$a.user._id", name: "$$a.user.name", email: "$$a.user.email" } }] }
    //         }
    //       }
    //     }
    //   },



    //   // Sorting
    //   { $sort: { [sortField]: sortOrder } },

    //   // Pagination + count in one request
    //   {
    //     $facet: {
    //       data: [{ $skip: skip }, { $limit: limit }],
    //       totalCount: [{ $count: "count" }]
    //     }
    //   }
    // ];

    const result = await ticketModel.aggregate(pipeline).exec();

    const data = result[0].data;
    const totalCount = result[0].totalCount[0]?.count || 0;

    return res.status(200).json({
      message: "success",
      data,
      totalCount,
      page,
      maxPerPage: limit
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "server error" });
  }


};

export const takeTicketInCharge=async(req:Request,res:Response)=>{
  try {
      const token = req.headers.authorization?.split(" ")[1];
if (!token) return res.status(409).json({ message: "not autorized" });
    const user = (await jwt.decode(token)) as TokenPayload;
    const { userId,role,organisation,organisationsList,activeStatus }=user;
    if (!userId) return res.status(409).json({ message: "not autorized" });
    const id=req.params.id;
    if(!id)return res.status(400).json({message:"id is required"})

    const ticket=await ticketModel.findById(id).exec();


    if(!ticket)return res.status(404).json({message:"ticket not found"})
          const hasPermission=checkIfUserCanTakeInCharge(ticket,user);
        if(!hasPermission)return res.status(409).json({message:"you don't have permission"})
      ticket.status="open";
      ticket.assignedTo={userId:new mongoose.Types.ObjectId(userId),date:new Date()}
    const history = ticket.assignementHistory
      ? [...ticket.assignementHistory, { userId: new mongoose.Types.ObjectId(userId), date: new Date() }]
      : [{ userId: new mongoose.Types.ObjectId(userId), date: new Date() }];

    ticket.set('assignementHistory', history);
    const message=req.body.message||"in_charge"
        const comment=await commentsModel.create({authorId:userId,ticketId:id,message,action:"in_charge",ticketRef:ticket.ref});
        if(!comment||!comment._id){
            return res.status(400).json({message:"error adding comment"});
        }
        ticket.lastComment=comment;
         ticket.comments.push(comment._id);
    await ticket.save();
    return res.status(200).json({message:"success",data:ticket})

  } catch (error) {
    return res.status(500).json({message:"server error",error})
  }
}


export const cancelTicketInCharge=async(req:Request,res:Response)=>{
  try {
      const token = req.headers.authorization?.split(" ")[1];
if (!token) return res.status(409).json({ message: "not autorized" });
    const user = (await jwt.decode(token)) as TokenPayload;
    const { userId }=user;
    if (!userId) return res.status(409).json({ message: "not autorized" });
    const id=req.params.id;
    if(!id)return res.status(400).json({message:"id is required"})

    const ticket=await ticketModel.findById(id).exec();


    if(!ticket)return res.status(404).json({message:"ticket not found"})
          const hasPermission=checkIfUSerCanPerformAction(ticket,user);
        if(!hasPermission)return res.status(409).json({message:"you don't have permission"})
      ticket.status="pending";
      ticket.assignedTo=null;
    const history = ticket.assignementHistory
      ? [...ticket.assignementHistory,null]
      : [null];

    ticket.set('assignementHistory', history);
    const message=req.body.message||""
        const comment=await commentsModel.create({authorId:userId,ticketId:id,message,action:"cancel_incharge",ticketRef:ticket.ref});
        if(!comment||!comment._id){
            return res.status(400).json({message:"error adding comment"});
        }
        ticket.lastComment=comment;
         ticket.comments.push(comment._id);
    await ticket.save();
    return res.status(200).json({message:"success",data:ticket})

  } catch (error) {
    return res.status(500).json({message:"server error",error})
  }
}
export const closeTicket=async (req:Request,res:Response)=>{
  try {
      const token = req.headers.authorization?.split(" ")[1];
if (!token) return res.status(409).json({ message: "not autorized" });
    const user = (await jwt.decode(token)) as TokenPayload;
    const { userId }=user;
    if (!userId) return res.status(409).json({ message: "not autorized" });
    const id=req.params.id;
    if(!id)return res.status(400).json({message:"id is required"})

    const ticket=await ticketModel.findById(id).exec();
    if(!ticket)return res.status(404).json({message:"ticket not found"})
      if(ticket.creator?._id.toString()!==userId&&user.role!=="admin"){
 return res.status(409).json({message:"you don't have permission"})
      }
      // if(!checkIfUSerCanPerformAction(ticket,user))return res.status(409).json({message:"you don't have permission"})
      ticket.status="complete";
    const message=req.body.message;
    const comment=await commentsModel.create({
      ticketId:ticket._id,
      authorId:userId,
      action:"close",
      message,
      ticketRef:ticket.ref
    })
    ticket.lastComment=comment;
    ticket.comments.push(comment._id)
    await ticket.save();
    return res.status(200).json({message:"success",data:ticket})

  } catch (error) {
    return res.status(500).json({message:"server error",error})
  }
}
export const traitTicket=async (req:Request,res:Response)=>{
  try {
      const token = req.headers.authorization?.split(" ")[1];
if (!token) return res.status(409).json({ message: "not autorized" });
    const user = (await jwt.decode(token)) as TokenPayload;
    const { userId }=user;
    if (!userId) return res.status(409).json({ message: "not autorized" });
    const id=req.params.id;
    if(!id)return res.status(400).json({message:"id is required"})

    const ticket=await ticketModel.findById(id).exec();
    if(!ticket)return res.status(404).json({message:"ticket not found"})
      if(!checkIfUSerCanPerformAction(ticket,user)){
 return res.status(409).json({message:"you don't have permission"})
      }
       
      ticket.status="traited";
    const message=req.body.message;
    const comment=await commentsModel.create({
      ticketId:ticket._id,
      authorId:userId,
      action:"trait",
      message,
      ticketRef:ticket.ref
    })
    ticket.lastComment=comment;
    ticket.comments.push(comment._id)
    await ticket.save();
    return res.status(200).json({message:"success",data:ticket})

  } catch (error) {
    console.log("--------------------->")
    console.log(error)
console.log("--------------------->")
    return res.status(500).json({message:"server error",error})
  }
}
export const addOrganisation=async(req:Request,res:Response)=>{
   try {
      const token = req.headers.authorization?.split(" ")[1];
if (!token) return res.status(409).json({ message: "not autorized" });
    const user = (await jwt.decode(token)) as TokenPayload;
    const { userId }=user;
    if (!userId) return res.status(409).json({ message: "not autorized" });
    const id=req.params.id;
    if(!id)return res.status(400).json({message:"id is required"})
      const organisation=req.body.organisationId;
     if(!organisation)return res.status(400).json({message:"organisation is required"})
       const foundOrganisation=await organisationModel.findById(organisation);
     if(!foundOrganisation)return res.status(404).json({message:"Organisation not found"});
    const ticket=await ticketModel.findById(id).exec();
    if(!ticket)return res.status(404).json({message:"ticket not found"})
      if(!checkIfUSerCanPerformAction(ticket,user))return res.status(409).json({message:"you don't have permission"})
      ticket.associatedOrganizations.push(new mongoose.Types.ObjectId(organisation));
    const message=req.body.message;
    const comment=await commentsModel.create({
      ticketId:ticket._id,
      authorId:userId,
      action:"subscribe",
      message,
      ticketRef:ticket.ref
    })
    ticket.lastComment=comment;
    ticket.comments.push(comment._id)
    await ticket.save();
    return res.status(200).json({message:"success",data:ticket})

  } catch (error) {
    return res.status(500).json({message:"server error",error})
  }
}
export const switchOrganisation=async(req:Request,res:Response)=>{
   try {
      const token = req.headers.authorization?.split(" ")[1];
if (!token) return res.status(409).json({ message: "not autorized" });
    const user = (await jwt.decode(token)) as TokenPayload;
    const { userId }=user;
    if (!userId) return res.status(409).json({ message: "not autorized" });
    const id=req.params.id;
    if(!id)return res.status(400).json({message:"id is required"})
      const organisation=req.body.organisationId;
     if(!organisation)return res.status(400).json({message:"organisation is required"});
     const foundOrganisation=await organisationModel.findById(organisation);
     if(!foundOrganisation)return res.status(404).json({message:"Organisation not found"});
    const ticket=await ticketModel.findById(id).exec();
    if(!ticket)return res.status(404).json({message:"ticket not found"})
      if(!checkIfUSerCanSwitchOrganisation(ticket,user,organisation))return res.status(409).json({message:"you don't have permission",user,ticket,organisation})
      //ticket.associatedOrganizations.push(new mongoose.Types.ObjectId(organisation));
      ticket.recipientOrganizationId=organisation;
    const message=req.body.message;
    const comment=await commentsModel.create({
      ticketId:ticket._id,
      authorId:userId,
      action:"switch",
      message,
      ticketRef:ticket.ref
    })
    ticket.lastComment=comment;
    ticket.comments.push(comment._id)
    await ticket.save();

    
    const pipeline:any = getPipline({
  match: { _id: ticket._id },
  limit: 1,
  skip: 0,
  sortField: "createdAt",
  sortOrder: -1
});

const result = await ticketModel.aggregate(pipeline as any).exec();
const formattedTicket = result[0]?.data?.[0] || null;

io.to(ticket.recipientOrganizationId.toString()).emit('notify', {action:"Ticket transféré",payload:formattedTicket,message:`Vous avez un nouveau ticket (${ticket.motif})`}); 
 
    return res.status(200).json({message:"success",data:formattedTicket})

  } catch (error) {
    return res.status(500).json({message:"server error",error})
  }
}
export const relanceTicket=async (req:Request,res:Response)=>{
  try {
  
    
      const token = req.headers.authorization?.split(" ")[1];
if (!token) return res.status(409).json({ message: "not autorized" });

    const user = (await jwt.decode(token)) as TokenPayload;
    const { userId,role }=user;
    if (!userId) return res.status(409).json({ message: "not autorized" });
    const id=req.params.id;
    if(!id)return res.status(400).json({message:"id is required"})
      const userName=(await userModel.findById(userId).lean().exec())?.name||"";
    const ticket=await ticketModel.findById(id).exec();
    if(!ticket)return res.status(404).json({message:"ticket not found"});
    if(role!=="admin"&&(!ticket.creator||ticket.creator._id.toString()!==userId)){
      return res.status(409).json({message:"you should be admin or the créatorof the tocket to be able to perform relanceTicket"})
    }
      ticket.status="open";
    const message=req.body.message;
    const comment=await commentsModel.create({
      ticketId:ticket._id,
      authorId:userId,
      action:"relancer",
      message,
      ticketRef:ticket.ref
    })
    ticket.lastComment=comment;
    ticket.comments.push(comment._id)
    await ticket.save();
     io.to(ticket.recipientOrganizationId.toString()).emit('notify', {action:"Ticket Relancé",payload:ticket,message:`${userName} a relancé votre ticket "Ref : "${ticket.ref}`}); 
     
    return res.status(200).json({message:"success",data:ticket})

  } catch (error) {
    console.log(error);
    
    return res.status(500).json({message:"server error",error})
  }
}
const getFilterFromType=(type:string,userId:string)=>{
switch(type){
    case "pending":{
        return {status:"pending"}
    }

    case "open":{
        return {status:"open"}
    }
    case "open_me":{
        return {status:"open","assignedTo.userId":new mongoose.Types.ObjectId(userId)}
    }
    case "complete":{
        return {status:"complete"}
    }
    case "traited":{
        return {status:"traited"}
    }
    default: return {};
}
}

const getResponsablitiesFilterFromRole:(user:TokenPayload,notag:string)=>any=(user,notag)=>{
   const role=user.role;
   const organisation=user.organisation ;
    const organisationsList=user.organisationsList.map(o=>new mongoose.Types.ObjectId(o))||[];
    if(role==="admin"){
return {}
    }
    else if(role==="supervisor"){
     return {$or: [
    { emitterOrganizationId:{ $in: [new mongoose.Types.ObjectId(organisation),...organisationsList] } },
    { recipientOrganizationId: { $in: [new mongoose.Types.ObjectId(organisation),...organisationsList] }  },
    { associatedOrganizations: { $in: [organisation,...user.organisationsList] } },
  ]
}   
    }
    else if(notag==="true"){
return{$or: [
    { emitterOrganizationId: new mongoose.Types.ObjectId(organisation) },
    { recipientOrganizationId: new mongoose.Types.ObjectId(organisation) },
  ]
}
    }
    else return{$or: [
    { emitterOrganizationId: new mongoose.Types.ObjectId(organisation) },
    { recipientOrganizationId: new mongoose.Types.ObjectId(organisation) },
     { associatedOrganizations: { $in: [new mongoose.Types.ObjectId(organisation)] } },
  ]
}

}

const getSearchFilter=(search:string)=>{
  if(!search)return {};

  else return {$or:[
    {ref:{ $regex: search, $options: "i" }}
   
  ]}
}

export const getTicketsByStatus = async (req:Request,res:Response) => {
  const user=getToken(req);
  if(!user)return res.status(404).json({message:"there is no user"});
  const reponsabilities=getResponsablitiesFilterFromRole(user,"false")
  console.log(reponsabilities)
  const tickets=await ticketModel.aggregate([
   {$match:{...reponsabilities}}, {
      
      $group: {
        _id: "$status",
        count: { $sum: 1 }
      }
    }
  ]);
  return res.status(200).json({data:tickets})
};
export const getTicketsByPriority = async (req:Request,res:Response) => {
  const user=getToken(req);
  if(!user)return res.status(404).json({message:"there is no user"});
  const reponsabilities=getResponsablitiesFilterFromRole(user,"false")
  const tickets=await ticketModel.aggregate([
   {$match:{...reponsabilities}}, {
      $group: {
        _id: "$priority",
        count: { $sum: 1 }
      }
    }
  ]);
};
export const getTicketsByEmitterOrg = async (req:Request,res:Response) => {
  const user=getToken(req);
  if(!user)return res.status(404).json({message:"there is no user"});
  const reponsabilities=getResponsablitiesFilterFromRole(user,"false")
  const tickets=await ticketModel.aggregate([
   {$match:{...reponsabilities}}, {
      $group: {
        _id: "$emitterOrganizationId",
        totalTickets: { $sum: 1 }
      }
    }
  ]);
};
export const getAssignedVsUnassigned = async (req:Request,res:Response) => {
  const user=getToken(req);
  if(!user)return res.status(404).json({message:"there is no user"});
  const reponsabilities=getResponsablitiesFilterFromRole(user,"false")
  const tickets=await ticketModel.aggregate([
   {$match:{...reponsabilities}}, {
      $group: {
        _id: {
          $cond: [{ $ifNull: ["$assignedTo.userId", false] }, "assigned", "unassigned"]
        },
        count: { $sum: 1 }
      }
    }
  ]);
};
export const getTicketsPerAgent = async () => {
  return ticketModel.aggregate([
    { $match: { "assignedTo.userId": { $ne: null } } },
    {
      $group: {
        _id: "$assignedTo.userId",
        ticketsCount: { $sum: 1 }
      }
    }
  ]);
};
export const getAverageResolutionTime = async () => {
  return ticketModel.aggregate([
    { $match: { status: "complete" } },
    {
      $project: {
        resolutionTime: {
          $subtract: ["$updatedAt", "$createdAt"]
        }
      }
    },
    {
      $group: {
        _id: null,
        avgResolutionTimeMs: { $avg: "$resolutionTime" }
      }
    }
  ]);
};
export const getTicketsPerDay = async () => {
  return ticketModel.aggregate([
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};
export const getHighPriorityOpenTickets = async () => {
  return ticketModel.countDocuments({
    priority: "high",
    status: { $ne: "complete" }
  });
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const user = getToken(req);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const reponsabilities = getResponsablitiesFilterFromRole(user,"false");

    const now = new Date();

    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const startOfNextYear = new Date(now.getFullYear() + 1, 0, 1);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const day = now.getDay() === 0 ? 7 : now.getDay();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - day + 1);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const [stats] = await ticketModel.aggregate([
      { $match: { ...reponsabilities } },
      {
        $facet: {
          byStatus: [
            { $group: { _id: "$status", count: { $sum: 1 } } }
          ],
          byPriority: [
            { $group: { _id: "$priority", count: { $sum: 1 } } }
          ],
          total: [{ $count: "totalTickets" }],
          assigned: [
            { $match: { "assignedTo.userId": { $ne: null } } },
            { $count: "assignedTickets" }
          ],
          motif: [
            { $group: { _id: "$motif", count: { $sum: 1 } } },
            //  { $sort: { count: -1 } },
            // {$limit:10}
          ],
          emmiter: [
            {
              $lookup: {
                from: "organisations",
                localField: "emitterOrganizationId",
                foreignField: "_id",
                as: "emitterOrg"
              }
            },
            { $unwind: "$emitterOrg" },
            {
              $group: {
                _id: "$emitterOrg._id",
                name: { $first: "$emitterOrg.name" },
                count: { $sum: 1 }
              }
            },
            { $sort: { count: -1 } },
            {$limit:10}
          ],
          recipient: [
            {
              $lookup: {
                from: "organisations",
                localField: "recipientOrganizationId",
                foreignField: "_id",
                as: "recipientOrg"
              }
            },
            { $unwind: "$recipientOrg" },
            {
              $group: {
                _id: "$recipientOrg._id",
                name: { $first: "$recipientOrg.name" },
                count: { $sum: 1 }
                
              }
              
            },
            { $sort: { count: -1 } },
            {$limit:10}
          ],

          // 📈 EVOLUTION
          yearByMonth: [
            { $match: { createdAt: { $gte: startOfYear, $lt: startOfNextYear } } },
            { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
            { $sort: { "_id": 1 } }
          ],
          monthByDay: [
            { $match: { createdAt: { $gte: startOfMonth, $lt: startOfNextMonth } } },
            { $group: { _id: { $dayOfMonth: "$createdAt" }, count: { $sum: 1 } } },
            { $sort: { "_id": 1 } }
          ],
          weekByDay: [
            { $match: { createdAt: { $gte: startOfWeek, $lt: endOfWeek } } },
            { $group: { _id: { $dayOfWeek: "$createdAt" }, count: { $sum: 1 } } },
            { $sort: { "_id": 1 } }
          ]
        }
      }
    ]);

    return res.status(200).json({ message: "success", data: stats });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error", error });
  }
};

 const checkIfUserCanTakeInCharge=(ticket:any,user:TokenPayload)=>{

  if(!ticket.status||ticket.status!=="pending")return false;

if(ticket.creator.toString()===user.userId)return false;
const isToUserOrganisation=user.organisation.toString()===ticket.recipientOrganizationId.toString();
let isUnderUserSupervision=false;
if(user.role==="supervisor"){
  user.organisationsList.forEach(o=>{
    if(ticket.recipientOrganizationId.toString()===o.toString()){
      isUnderUserSupervision=true;
      return;
    }
  })
};
if(user.role==="admin")isUnderUserSupervision=true;
console.log({isToUserOrganisation,isUnderUserSupervision,creator:{user:user.userId,ticketCreator:ticket.creator}})
return isToUserOrganisation||isUnderUserSupervision;
}

const checkIfUSerCanPerformAction=(ticket:any,user:TokenPayload)=>{
 // console.log({ticket,user})
 if(!ticket.status||ticket.status==="pending")return false;

if(ticket.creator.toString()===user.userId)return false;
const isAssignedTome=user.userId.toString()===ticket.assignedTo.userId.toString();
const isAdmin=user.role==="admin";


return isAssignedTome||isAdmin;
} 

const checkIfUSerCanSwitchOrganisation=(ticket:any,user:TokenPayload,organisaionToId:string)=>{

 const ticketOrganisationId=ticket.recipientOrganizationId.toString();

 if(!ticket.status||ticket.status!=="pending")return false;
if(user.role==="admin")return true;
if(user.role==="supervisor"&&user.organisationsList.includes(ticketOrganisationId)&&user.organisationsList.includes(organisaionToId))return true;

return false;
} 


export const getNotCompleteReport = async (req: Request, res: Response) => {
  try {
    // ================= AUTH =================
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "not authorized" });

    const user = jwt.decode(token) as TokenPayload;
    if (!user?.userId || !user.organisation)
      return res.status(401).json({ message: "not authorized" });

    // ================= DATE =================
    const yesterDay = new Date();
    yesterDay.setHours(0, 0, 0, 0);

    // ================= FILTERS =================
    const baseFilter: any = user.role==="standard"?{
     $or:[
        
        {
        emitterOrganizationId:new mongoose.Types.ObjectId(user.organisation),
      },
      {
        recipientOrganizationId:new mongoose.Types.ObjectId(user.organisation),
      }
      ]
  }: {
      ...getResponsablitiesFilterFromRole(user,"false"),
    };
  
    
    const notCompleteFilter = {
      $or: [
        {
          status: "pending",
          createdAt: { $lt: yesterDay },
      //     emitterOrganizationId: {
      //   $ne: new mongoose.Types.ObjectId(user.organisation),
      // },
        },
        {
          status: "open",
        //   emitterOrganizationId: {
        // $ne: new mongoose.Types.ObjectId(user.organisation),},
            $or: [
        { "assignedTo.date": { $lt: yesterDay } },
        { assignedTo: { $exists: false } },
        { assignedTo: null },
        
      ],
        },
        {status: "traited", 
          // emitterOrganizationId: new mongoose.Types.ObjectId(user.organisation),
        },
        
      ],
    };

    const pipeline:any[]=getPipline({match: {
         $and: [
    { ...baseFilter }, // this may include $or
    { ...notCompleteFilter } // this also includes $or
  ]
        }
      ,limit:1000
      })
    // ================= PIPELINE =================
  //   const pipeline: any[] = [
  //     // ===== match =====
  //     {
  //       $match: {
  //        $and: [
  //   { ...baseFilter }, // this may include $or
  //   { ...notCompleteFilter } // this also includes $or
  // ]
  //       },
  //     },

  //     // ===== normalize assignedTo =====
  //     {
  //       $addFields: {
  //         assignedTo: {
  //           $cond: [
  //             { $isArray: "$assignedTo" },
  //             "$assignedTo",
  //             {
  //               $cond: [
  //                 { $eq: ["$assignedTo", null] },
  //                 [],
  //                 ["$assignedTo"],
  //               ],
  //             },
  //           ],
  //         },
  //       },
  //     },

  //     // ===== creator =====
  //     {
  //       $lookup: {
  //         from: "users",
  //         localField: "creator",
  //         foreignField: "_id",
  //         as: "creator",
  //       },
  //     },
  //     { $unwind: { path: "$creator", preserveNullAndEmptyArrays: true } },

  //     // ===== organizations =====
  //     {
  //       $lookup: {
  //         from: "organisations",
  //         localField: "emitterOrganizationId",
  //         foreignField: "_id",
  //         as: "emitterOrganization",
  //       },
  //     },
  //     {
  //       $unwind: {
  //         path: "$emitterOrganization",
  //         preserveNullAndEmptyArrays: true,
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: "organisations",
  //         localField: "recipientOrganizationId",
  //         foreignField: "_id",
  //         as: "recipientOrganization",
  //       },
  //     },
  //     {
  //       $unwind: {
  //         path: "$recipientOrganization",
  //         preserveNullAndEmptyArrays: true,
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: "organisations",
  //         localField: "associatedOrganizations",
  //         foreignField: "_id",
  //         as: "associatedOrganizations",
  //       },
  //     },

  //     // ===== assigned users =====
  //     {
  //       $lookup: {
  //         from: "users",
  //         localField: "assignedTo.userId",
  //         foreignField: "_id",
  //         as: "assignedUsers",
  //       },
  //     },

  //     // ===== enrich assignedTo =====
  //     {
  //       $addFields: {
  //         assignedTo: {
  //           $map: {
  //             input: "$assignedTo",
  //             as: "a",
  //             in: {
  //               date: "$$a.date",
  //               user: {
  //                 $let: {
  //                   vars: {
  //                     u: {
  //                       $arrayElemAt: [
  //                         {
  //                           $filter: {
  //                             input: "$assignedUsers",
  //                             as: "u",
  //                             cond: {
  //                               $eq: ["$$u._id", "$$a.userId"],
  //                             },
  //                           },
  //                         },
  //                         0,
  //                       ],
  //                     },
  //                   },
  //                   in: {
  //                     $cond: [
  //                       { $eq: ["$$u", null] },
  //                       null,
  //                       {
  //                         _id: "$$u._id",
  //                         name: "$$u.name",
  //                         email: "$$u.email",
  //                       },
  //                     ],
  //                   },
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },
  //     { $project: { assignedUsers: 0 } },

  //     // ===== last comment =====
  //     {
  //       $lookup: {
  //         from: "users",
  //         localField: "lastComment.authorId",
  //         foreignField: "_id",
  //         as: "lastCommentAuthor",
  //       },
  //     },
  //     {
  //       $addFields: {
  //         lastComment: {
  //           $cond: [
  //             { $gt: [{ $size: "$lastCommentAuthor" }, 0] },
  //             {
  //               $mergeObjects: [
  //                 "$lastComment",
  //                 {
  //                   author: {
  //                     $arrayElemAt: ["$lastCommentAuthor", 0],
  //                   },
  //                 },
  //               ],
  //             },
  //             "$lastComment",
  //           ],
  //         },
  //       },
  //     },
  //     { $project: { lastCommentAuthor: 0 } },

  //     // ===== final projection =====
  //     {
  //       $project: {
  //         _id: 1,
  //         ref: 1,
  //         formName: 1,
  //         motif:1,
  //         message: 1,
  //         status: 1,
  //         priority: 1,
  //         createdAt: 1,
  //         updatedAt: 1,
  //         specialFields: 1,

  //         creator: {
  //           _id: "$creator._id",
  //           name: "$creator.name",
  //           email: "$creator.email",
  //         },

  //         emitterOrganization: {
  //           _id: "$emitterOrganization._id",
  //           name: "$emitterOrganization.name",
  //         },

  //         recipientOrganization: {
  //           _id: "$recipientOrganization._id",
  //           name: "$recipientOrganization.name",
  //         },

  //         associatedOrganizations: {
  //           $map: {
  //             input: { $ifNull: ["$associatedOrganizations", []] },
  //             as: "o",
  //             in: { _id: "$$o._id", name: "$$o.name" },
  //           },
  //         },

  //         assignedTo: { $arrayElemAt: ["$assignedTo", 0] },

  //         lastComment: {
  //           _id: "$lastComment._id",
  //           message: "$lastComment.message",
  //           action: "$lastComment.action",
  //           ticketRef: "$lastComment.ticketRef",
  //           createdAt: "$lastComment.createdAt",
  //           author: {
  //             _id: "$lastComment.author._id",
  //             name: "$lastComment.author.name",
  //             email: "$lastComment.author.email",
  //           },
  //         },
  //       },
  //     },

  //     // ===== pagination + count =====
  //     {
  //       $facet: {
  //         data: [{ $sort: { createdAt: 1 } }],
  //         totalCount: [{ $count: "count" }],
  //       },
  //     },
  //   ];

    // ================= EXEC =================
    const result = await ticketModel.aggregate(pipeline).exec();

    return res.status(200).json({
      message: "success",
      data: result[0]?.data ?? [],
      totalCount: result[0]?.totalCount?.[0]?.count ?? 0,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
};

export const getTicketReport = async (req: Request, res: Response) => {
  try {
    // ================= AUTH =================
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "not authorized" });

    const user = jwt.decode(token) as TokenPayload;
    if (!user?.userId || !user.organisation)
      return res.status(401).json({ message: "not authorized" });

    // ================= DATE =================
    const yesterDay = new Date();
    yesterDay.setHours(0, 0, 0, 0);
    const startdayString=req.body.startday;
    const enddayString=req.body.endday;
    if(!startdayString||!enddayString)return res.status(400).json({message:"Start day and end Day are required!!"})
      const startday=new Date(startdayString);
      const endday=new Date(enddayString);
    // ================= FILTERS =================
    const baseFilter: any = {
      ...getResponsablitiesFilterFromRole(user,"false"),
      emitterOrganizationId: {
        $ne: new mongoose.Types.ObjectId(user.organisation),
      },
    };

    const dateFilter = {
     createdAt: {
    $gte: startday,
    $lte: endday
  }
    }

    // ================= PIPELINE =================
    const pipeline:any[]=getPipline({match: {
          ...baseFilter,
          ...dateFilter,
        },limit:10000})

    // const pipeline: any[] = [
    //   // ===== match =====
    //   {
    //     $match: {
    //       ...baseFilter,
    //       ...dateFilter,
    //     },
    //   },

    //   // ===== normalize assignedTo =====
    //   {
    //     $addFields: {
    //       assignedTo: {
    //         $cond: [
    //           { $isArray: "$assignedTo" },
    //           "$assignedTo",
    //           {
    //             $cond: [
    //               { $eq: ["$assignedTo", null] },
    //               [],
    //               ["$assignedTo"],
    //             ],
    //           },
    //         ],
    //       },
    //     },
    //   },

    //   // ===== creator =====
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "creator",
    //       foreignField: "_id",
    //       as: "creator",
    //     },
    //   },
    //   { $unwind: { path: "$creator", preserveNullAndEmptyArrays: true } },

    //   // ===== organizations =====
    //   {
    //     $lookup: {
    //       from: "organisations",
    //       localField: "emitterOrganizationId",
    //       foreignField: "_id",
    //       as: "emitterOrganization",
    //     },
    //   },
    //   {
    //     $unwind: {
    //       path: "$emitterOrganization",
    //       preserveNullAndEmptyArrays: true,
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "organisations",
    //       localField: "recipientOrganizationId",
    //       foreignField: "_id",
    //       as: "recipientOrganization",
    //     },
    //   },
    //   {
    //     $unwind: {
    //       path: "$recipientOrganization",
    //       preserveNullAndEmptyArrays: true,
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "organisations",
    //       localField: "associatedOrganizations",
    //       foreignField: "_id",
    //       as: "associatedOrganizations",
    //     },
    //   },

    //   // ===== assigned users =====
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "assignedTo.userId",
    //       foreignField: "_id",
    //       as: "assignedUsers",
    //     },
    //   },

    //   // ===== enrich assignedTo =====
    //   {
    //     $addFields: {
    //       assignedTo: {
    //         $map: {
    //           input: "$assignedTo",
    //           as: "a",
    //           in: {
    //             date: "$$a.date",
    //             user: {
    //               $let: {
    //                 vars: {
    //                   u: {
    //                     $arrayElemAt: [
    //                       {
    //                         $filter: {
    //                           input: "$assignedUsers",
    //                           as: "u",
    //                           cond: {
    //                             $eq: ["$$u._id", "$$a.userId"],
    //                           },
    //                         },
    //                       },
    //                       0,
    //                     ],
    //                   },
    //                 },
    //                 in: {
    //                   $cond: [
    //                     { $eq: ["$$u", null] },
    //                     null,
    //                     {
    //                       _id: "$$u._id",
    //                       name: "$$u.name",
    //                       email: "$$u.email",
    //                     },
    //                   ],
    //                 },
    //               },
    //             },
    //           },
    //         },
    //       },
    //     },
    //   },
    //   { $project: { assignedUsers: 0 } },

    //   // ===== last comment =====
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "lastComment.authorId",
    //       foreignField: "_id",
    //       as: "lastCommentAuthor",
    //     },
    //   },
    //   {
    //     $addFields: {
    //       lastComment: {
    //         $cond: [
    //           { $gt: [{ $size: "$lastCommentAuthor" }, 0] },
    //           {
    //             $mergeObjects: [
    //               "$lastComment",
    //               {
    //                 author: {
    //                   $arrayElemAt: ["$lastCommentAuthor", 0],
    //                 },
    //               },
    //             ],
    //           },
    //           "$lastComment",
    //         ],
    //       },
    //     },
    //   },
    //   { $project: { lastCommentAuthor: 0 } },

    //   // ===== final projection =====
    //   {
    //     $project: {
    //       _id: 1,
    //       ref: 1,
    //       formName: 1,
    //        motif:1,
    //       message: 1,
    //       status: 1,
    //       priority: 1,
    //       createdAt: 1,
    //       updatedAt: 1,
    //       specialFields: 1,

    //       creator: {
    //         _id: "$creator._id",
    //         name: "$creator.name",
    //         email: "$creator.email",
    //       },

    //       emitterOrganization: {
    //         _id: "$emitterOrganization._id",
    //         name: "$emitterOrganization.name",
    //       },

    //       recipientOrganization: {
    //         _id: "$recipientOrganization._id",
    //         name: "$recipientOrganization.name",
    //       },

    //       associatedOrganizations: {
    //         $map: {
    //           input: { $ifNull: ["$associatedOrganizations", []] },
    //           as: "o",
    //           in: { _id: "$$o._id", name: "$$o.name" },
    //         },
    //       },

    //       assignedTo: { $arrayElemAt: ["$assignedTo", 0] },

    //       lastComment: {
    //         _id: "$lastComment._id",
    //         message: "$lastComment.message",
    //         action: "$lastComment.action",
    //         ticketRef: "$lastComment.ticketRef",
    //         createdAt: "$lastComment.createdAt",
    //         author: {
    //           _id: "$lastComment.author._id",
    //           name: "$lastComment.author.name",
    //           email: "$lastComment.author.email",
    //         },
    //       },
    //     },
    //   },

    //   // ===== pagination + count =====
    //   {
    //     $facet: {
    //       data: [{ $sort: { createdAt: 1 } }],
    //       totalCount: [{ $count: "count" }],
    //     },
    //   },
    // ];

    // ================= EXEC =================
    const result = await ticketModel.aggregate(pipeline).exec();

    return res.status(200).json({
      message: "success",
      data: result[0]?.data ?? [],
      totalCount: result[0]?.totalCount?.[0]?.count ?? 0,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
};

export const getTicketsStatsForSideBar=async(req:Request,res:Response)=>{
   try {
    console.log("-----------------------------")
    const user = getToken(req);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    
const baseFilter: any = {
      ...getResponsablitiesFilterFromRole(user,"false"),
      emitterOrganizationId: {
        $ne: new mongoose.Types.ObjectId(user.organisation),
      },
    };



    const [received] = await ticketModel.aggregate([
      { $match: { ...baseFilter } },
      {
        $facet: {
          byStatus: [
            { $group: { _id: "$status", count: { $sum: 1 } } }
          ],
          assignedTome:[
            {$match:{"assignedTo.userId":new mongoose.Types.ObjectId(user.userId) ,status:"open"}},
             { $count: "assignedTickets" }
          ],
          

          total: [{ $count: "totalReceivedTickets" }],
          
         
        }
      }
    ]);
    
    let receivedData:any=[];
    if(received.byStatus&&Array.isArray(received.byStatus)){
      receivedData=received.byStatus;
    }
    if(received.assignedTome&&Array.isArray(received.assignedTome)){
      receivedData.push({_id:"open_me",count:received.assignedTome.at(0)?.assignedTickets||0});
    }
    if(received.total){
      receivedData.push({_id:"total",count:received.total.at(0)?.totalReceivedTickets||0})
    }
    const receivedResult = receivedData.reduce((acc:any, { _id, count }:any) => {
  acc[_id] = count;
  return acc;
}, {});
    const [sent] = await ticketModel.aggregate([
      { $match: {emitterOrganizationId:new mongoose.Types.ObjectId(user.organisation)} },
      {
        $facet: {
          byStatus: [
            { $group: { _id: "$status", count: { $sum: 1 } } }
          ],
          

          total: [{ $count: "totalSentTickets" }],
          
         
        }
      }
    ]);
    let sentData:any=[];
    if(sent.byStatus&&Array.isArray(sent.byStatus)){
      sentData=sent.byStatus;
    }if(sent.total){
      sentData.push({_id:"total",count:sent.total.at(0)?.totalSentTickets})
    }
    
    const sentResult = sentData.reduce((acc:any, { _id, count }:any) => {
  acc[_id] = count;
  return acc;
}, {});
    return res.status(200).json({ message: "success", data: {sent:sentResult,received:receivedResult} });
  }catch (error) {
    res.status(500).json({message:"server error",error});
    console.log(error);
  }
}

export const searchTicketWithRef=async(req:Request,res:Response)=>{
  try {
    const ref=req.params.ref.toUpperCase();
    if(!ref)return res.status(409).json({message:"Ref is required!!!"});
    const pipeline:any[]=getPipline({match:{ref},limit:100})
    const tickets= await ticketModel.aggregate(pipeline).exec();
    if(!tickets||!Array.isArray(tickets)||tickets.length<1)return res.status(404).json({message:"there are no ticket with such ref"});
    return res.status(200).json({message:"success",data:tickets})
  } catch (error) {
    return res.status(500).json({message:"Server Error",error});
  }
}








