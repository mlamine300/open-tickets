import { Request, Response } from "express"
import jwt from "jsonwebtoken";
import { TokenPayload } from "../types/index.ts";
import ticketModel from "../models/Ticket.ts";
import { ticket, User } from "../../../types/index.ts";
import { getFieldsFromFormName, getOrganisationId, getOrganisationsId } from "../utils/index.ts";
import { commentsModel } from "../models/Comment.ts";
import { populate } from "dotenv";
import { PipelineStage } from "mongoose";
export const addTicket=async(req:Request,res:Response)=>{
   

   
    try {
        //checking auth
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(409).json({ message: "not autorized" });
        const { userId,organisation:emitterOrganizationId,activeStatus } = (await jwt.decode(token)) as TokenPayload;
        if (!userId||!activeStatus) return res.status(409).json({ message: "not autorized" });
        
        //checking request format
        if(!req?.body)return res.status(400).json({message:"there are no fields in request body"})
        const{organisationDest,organisationTag,formName,message}=req.body;
        if(!organisationDest||!formName||!message){
            return res.status(400).json({message:"fields are required {recipientOrganizationId ,associatedOrganizations ,type and message}"});
        }
        //transform organisation data from name to id
        const recipientOrganizationId=await getOrganisationId(organisationDest as string);
        const associatedOrganizations=(organisationTag&& Array.isArray(organisationTag)&& organisationTag.length)? (await getOrganisationsId(organisationTag) ):[]
        //getting form custom fields and check if request match the form
        const fields=await getFieldsFromFormName(formName);
        const specialFields:any={};
        if(fields!==null){
            const bodyFields=Object.keys(req.body);
            //if there is a required field missing in the request return 400
            fields.forEach(f=>{
                if(f.required&&!bodyFields.includes(f.name)){
                    return res.status(400).json({message:`${f.name} is required`});
                }
                //add all custom fields in "specialFields" object
                specialFields[f.name]=req.body[f.name];
            })
        }
        
        //
        const priority=req.body?.priority?.toLowerCase()||"low";
        const commentsId:any[]=[];
       
        const ticket=await ticketModel.create({creator:userId,
           emitterOrganizationId, recipientOrganizationId,associatedOrganizations,formName,message,specialFields,priority,commentsId
        })
        return res.status(200).json({message:"success",data:ticket})

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
    const skip = (page - 1) * limit;

    // Sorting
    const sortField = req.body?.sortField || "createdAt";
    const sortOrder = req.body?.sortOrder === "asc" ? 1 : -1;

    // Search
    const search = req.body?.search || "";

    // Filters
    const type = req.params.type || "pending";
    const baseFilter = {
      ...getResponsablitiesFilterFromRole(user),
      ...getFilterFromType(type, userId),
      creator: { $ne: userId }
    };

    // Search conditions
    // const searchQuery = search
    //   ? {
    //       $or: [
    //         { title: { $regex: search, $options: "i" } },
    //         { description: { $regex: search, $options: "i" } }
    //       ]
    //     }
    //   : {};

    const pipeline: any[] = [
      { $match: { ...baseFilter,
        //  ...searchQuery
         } },

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

  //    {
  //   $addFields: {
  //     assignedTo: {
  //       $cond: [
  //         { $ifNull: ["$assignedTo", false] },

  //         {
  //           user: { $arrayElemAt: ["$assignedToUser", 0] },
  //           date: "$assignedTo.date"
  //         },

  //         null
  //       ]
  //     }
  //   }
  // },

  // Replace assignementHistory[i].userId with full user doc
  // {
  //   $addFields: {
  //     assignementHistory: {
  //       $map: {
  //         input: "$assignementHistory",
  //         as: "a",
  //         in: {
  //           user: {
  //             $arrayElemAt: [
  //               {
  //                 $filter: {
  //                   input: "$historyUsers",
  //                   as: "hu",
  //                   cond: { $eq: ["$$hu._id", "$$a.userId"] }
  //                 }
  //               },
  //               0
  //             ]
  //           },
  //           date: "$$a.date"
  //         }
  //       }
  //     }
  //   }
  // },

      // Sorting
      { $sort: { [sortField]: sortOrder } },

      // Pagination + count in one request
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: "count" }]
        }
      }
    ];

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


// export const getTickets=async(req:Request,res:Response)=>{
    
// const token = req.headers.authorization?.split(" ")[1];
// if (!token) return res.status(409).json({ message: "not autorized" });
//     const user = (await jwt.decode(token)) as TokenPayload;
//     const { userId }=user;
//     if (!userId) return res.status(409).json({ message: "not autorized" });

//     const maxPerPage:number=Number(req.body?.maxPerPage)||10
//     const page:number=Number( req.body?.page)||1;
//     const type=req.params.type||"pending";
//     const arggFromAcount=getResponsablitiesFilterFromRole(user)
//     const arrgToAdd=getFilterFromType(type,userId);
//     let tickets=[];
    
//     console.log({...arggFromAcount,...arrgToAdd});
//     /**
//      * 
//      * 
//      * db.collection.aggregate([
//   { $match: { status: "active" } },
//   { $facet: {
//       metadata: [ { $count: "total" } ],
//       data: [ { $sort: { date: -1 } }, { $skip: 0 }, { $limit: 20 } ]
//   } }
// ])
//      */
//     const x=await ticketModel.aggregate([
//       {$match:{...arggFromAcount,...arrgToAdd,creator:{ $ne: userId }}},
//       { $facet: {
//       metadata: [ { $count: "total" } ],
//       data: [  { $skip: (page-1)*maxPerPage }, { $limit: maxPerPage } ]
//   }

// },{
//         $lookup: {
//           from: 'organisation', // The collection to join with (pluralized name of the model)
//           localField: 'emitterOrganizationId', // Field from the input documents
//           foreignField: 'name',      // Field from the documents of the "from" collection
//           as: 'emitterOrganization'      // The name of the new array field to add to the input documents
//         }
//       },
//     ])
//     console.log("x0");
    
//     console.log(x[0]);
//      console.log("x1");
//      console.log(x[1]);
    
//     tickets=await ticketModel.find({...arggFromAcount,...arrgToAdd,creator:{ $ne: userId }})  
//     .skip((page-1)*maxPerPage).limit(maxPerPage).populate("creator", ["name","email"]) 
//       .populate("emitterOrganizationId", "name")
//         .populate("recipientOrganizationId", "name")
//         .populate("associatedOrganizations", "name")
//         .populate("assignedTo.userId","name")
//       .lean().exec();
     
//     //console.log(tickets);
    
//     return res.status(200).json({message:"success",data:tickets})
// }

export const getTicketByid=async(req:Request,res:Response)=>{
   try {
     const token = req.headers.authorization?.split(" ")[1];
if (!token) return res.status(409).json({ message: "not autorized" });
    const user = (await jwt.decode(token)) as TokenPayload;
    const { userId,role,organisation,organisationsList,activeStatus }=user;
    if (!userId) return res.status(409).json({ message: "not autorized" });
    const id=req.params.id;
    if(!id)return res.status(400).json({message:"id is required"})

    const ticket=await ticketModel.findById(id);
    if(!ticket)return res.status(404).json({message:"ticket not found"})
        return res.status(200).json({message:"success",data:ticket})
   } catch (error) {
    console.log(error);
    return res.status(500).json({message:"server error",error})
    
   }
}

// export const getMytickets=async(req:Request,res:Response)=>{
  
//     try {
        
        
        
//     const token = req.headers.authorization?.split(" ")[1];
// if (!token) return res.status(409).json({ message: "not autorized" });
//     const user = (await jwt.decode(token)) as TokenPayload;
//     const { userId }=user;
//     if (!userId) return res.status(409).json({ message: "not autorized" });
       
        
//     const maxPerPage:number=Number(req.body?.maxPerPage)||10
//     const page:number=Number(req.body?.page)||1;
//     const status=req.params.status;
//     const tickets=await ticketModel.find({creator:userId,status}).skip((page-1) * 10).limit(maxPerPage).populate("creator", ["name","email"]) 
//       .populate("emitterOrganizationId", "name")
//         .populate("recipientOrganizationId", "name")
//         .populate("associatedOrganizations", "name")
//         .populate("assignedTo.userId","name").lean().exec();
//     if(!tickets||!Array.isArray(tickets)||!tickets.length){
//         return res.status(200).json({message:"there are no ticket",data:[]})
//     }
//    return res.status(200).json({message:"success",data:tickets})
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({message:"server error",error})
        
//     }
// }

export const getMytickets = async (req: Request, res: Response) => {
  try {

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(409).json({ message: "not autorized" });

    const user = (await jwt.decode(token)) as TokenPayload;
    const { userId } = user;
    if (!userId) return res.status(409).json({ message: "not autorized" });

    const maxPerPage: number = Number(req.body?.maxPerPage) || 10;
    const page: number = Number(req.body?.page) || 1;
    const status = req.params.status;

    const matchStage: any = { creator: userId };
    if (status) matchStage.status = status;

    // Import PipelineStage from mongoose or mongodb at the top of your file:
    // import { PipelineStage } from "mongoose";
    // or
    // import type { PipelineStage } from "mongodb";

    const pipeline: PipelineStage[] = [
      { $match: matchStage },

      // Count documents efficiently
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [
            { $sort: { createdAt: -1 } },
            { $skip: (page - 1) * maxPerPage },
            { $limit: maxPerPage },

            // --- POPULATE creator ---
            {
              $lookup: {
                from: "users",
                localField: "creator",
                foreignField: "_id",
                as: "creator"
              }
            },
            { $unwind: { path: "$creator", preserveNullAndEmptyArrays: true } },

            // --- POPULATE organizations ---
            {
              $lookup: {
                from: "organisations",
                localField: "emitterOrganizationId",
                foreignField: "_id",
                as: "emitterOrganizationId"
              }
            },
            { $unwind: { path: "$emitterOrganizationId", preserveNullAndEmptyArrays: true } },

            {
              $lookup: {
                from: "organisations",
                localField: "recipientOrganizationId",
                foreignField: "_id",
                as: "recipientOrganizationId"
              }
            },
            { $unwind: { path: "$recipientOrganizationId", preserveNullAndEmptyArrays: true } },

            {
              $lookup: {
                from: "organisations",
                localField: "associatedOrganizations",
                foreignField: "_id",
                as: "associatedOrganizations"
              }
            },

            // --- Handle assignedTo ---
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

            { $project: { assignedUsers: 0 } }
,
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
                creator: { _id: "$creator._id", name: "$creator.name", email: "$creator.email" },
                emitterOrganizationId: { _id: "$emitterOrganizationId._id", name: "$emitterOrganizationId.name" },
                recipientOrganizationId: { _id: "$recipientOrganizationId._id", name: "$recipientOrganizationId.name" },
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
            }
          ]
        }
      },

 

      {
        $project: {
          data: "$data",
          total: { $ifNull: [{ $arrayElemAt: ["$metadata.total", 0] }, 0] }
        }
      }
    ];

    const result = await ticketModel.aggregate(pipeline);
    const tickets = result[0].data;
    const totalCount = result[0].total;
    console.log(totalCount);
    
    return res.status(200).json({
      message: "success",
      totalCount,
      page,
      maxPerPage,
      data: tickets
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error", error });
  }
};

const getFilterFromType=(type:string,userId:string)=>{
switch(type){
    case "pending":{
        return {status:"pending"}
    }

    case "open":{
        return {status:"open"}
    }
    case "open_me":{
        return {status:"open","assignedTo.userId":userId}
    }
    case "close":{
        return {status:"close"}
    }
    default: return {};
}
}

const getResponsablitiesFilterFromRole=(user:TokenPayload)=>{
    const {role,organisation}=user;
    const organisationsList=user.organisationsList||[];
    if(role==="standard"){
return{$or: [
    { emitterOrganizationId: organisation },
    { recipientOrganizationId: organisation }
  ]
}
    }
    else if(role==="supervisor"){
     return {$or: [
    { emitterOrganizationId:{ $in: [organisation,...organisationsList] } },
    { recipientOrganizationId: { $in: [organisation,...organisationsList] }  },
    { associatedOrganizations: { $in: [organisation,...organisationsList] } },
  ]
}   
    }
    else return {}

}

