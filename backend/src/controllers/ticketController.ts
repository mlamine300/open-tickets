import { Request, Response } from "express"
import jwt from "jsonwebtoken";
import { TokenPayload } from "../types/index.js";
import ticketModel from "../models/Ticket.js";
import { getFieldsFromFormName, getOrganisationId, getOrganisationsId, getToken } from "../utils/index.js";
import { commentsModel } from "../models/Comment.js";
import mongoose from "mongoose";
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
        const attachement=req.body?.attachement||"";
        const commentsId:any[]=[];
        
       console.log(req.body);
       
        const ticket=await ticketModel.create({creator:userId,attachement,
           emitterOrganizationId, recipientOrganizationId,associatedOrganizations,formName,message,specialFields,priority,commentsId,ref
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
    const priority=req.body?.priority||null;
    const emitterOrganizationId=req.body?.emitterOrganizationId||null;
     const recipientOrganizationId=req.body?.recipientOrganizationId||null;
    const skip = (page - 1) * limit;


    // Sorting
    const sortField = req.body?.sortField || "createdAt";
    const sortOrder = req.body?.sortOrder === "asc" ? 1 : -1;

    // Search
    const search = req.body?.search || "";


    // Filters
    const type = req.params.type || "pending";
    const baseFilter:any = {
      ...getResponsablitiesFilterFromRole(user),
      ...getFilterFromType(type, userId),
      creator: { $ne: new mongoose.Types.ObjectId(userId) }
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
    const searchFilter=getSearchFilter(search)


    const pipeline: any[] = [
      { $match: { ...baseFilter,...searchFilter
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




export const getTicketByid=async(req:Request,res:Response)=>{
   try {
     const token = req.headers.authorization?.split(" ")[1];
if (!token) return res.status(409).json({ message: "not autorized" });
    const user = (await jwt.decode(token)) as TokenPayload;
    const { userId }=user;
    if (!userId) return res.status(409).json({ message: "not autorized" });
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

    // Sorting
    const sortField = req.body?.sortField || "createdAt";
    const sortOrder = req.body?.sortOrder === "asc" ? 1 : -1;

    // Search
    const search = req.body?.search || "";
console.log(JSON.stringify({...getResponsablitiesFilterFromRole(user)}));

    // Filters
    const type = req.params.type || "pending";
    const baseFilter:any = {
      ...getResponsablitiesFilterFromRole(user),
      ...getFilterFromType(type, userId),
      creator:  new mongoose.Types.ObjectId(userId) 
    };
    if(status){
      baseFilter.status=status;
    }
if(priority){
  baseFilter["priority"]=priority;
}

if(recipientOrganizationId){
  baseFilter.recipientOrganizationId=new mongoose.Types.ObjectId(recipientOrganizationId);
}
   
    const searchFilter=getSearchFilter(search)
    const pipeline: any[] = [
      { $match: { ...baseFilter,...searchFilter
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
export const relanceTicket=async (req:Request,res:Response)=>{
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
      ticket.status="pending";
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
    case "close":{
        return {status:"close"}
    }
    default: return {};
}
}

const getResponsablitiesFilterFromRole:(user:TokenPayload)=>any=(user)=>{
   const role=user.role;
   const organisation=new mongoose.Types.ObjectId(user.organisation);
    const organisationsList=user.organisationsList.map(o=>new mongoose.Types.ObjectId(o))||[];
    if(role==="admin"){
return {}
    }
    else if(role==="supervisor"){
     return {$or: [
    { emitterOrganizationId:{ $in: [organisation,...organisationsList] } },
    { recipientOrganizationId: { $in: [organisation,...organisationsList] }  },
    { associatedOrganizations: { $in: [organisation,...organisationsList] } },
  ]
}   
    }
    else return{$or: [
    { emitterOrganizationId: organisation },
    { recipientOrganizationId: organisation }
  ]
}

}

const getSearchFilter=(search:string)=>{
  if(!search)return {};

  else return {$or:[
    {ref:{ $regex: search, $options: "i" }}
   
  ]}
}

/*
  *******************************************************************************************************************************
  *******************************************************************************************************************************
  *******************************************************************************************************************************
  *******************************************************************************************************************************
  *******************************************************************************************************************************
 */
export const getTicketsByStatus = async (req:Request,res:Response) => {
  const user=getToken(req);
  if(!user)return res.status(404).json({message:"there is no user"});
  const reponsabilities=getResponsablitiesFilterFromRole(user)
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
  const reponsabilities=getResponsablitiesFilterFromRole(user)
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
  const reponsabilities=getResponsablitiesFilterFromRole(user)
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
  const reponsabilities=getResponsablitiesFilterFromRole(user)
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
// export const getDashboardStats = async (req:Request,res:Response) => {
//     try {
//       const user=getToken(req);
//   if(!user)return res.status(404).json({message:"there is no user"});
//   const reponsabilities=getResponsablitiesFilterFromRole(user) 
//   const [stats] = await ticketModel.aggregate([
//     {
//       $facet: {
//         byStatus: [
//           {$match:{...reponsabilities}},
//           { $group: { _id: "$status", count: { $sum: 1 } } }
//         ],
//         byPriority: [
//           {$match:{...reponsabilities}},
//           { $group: { _id: "$priority", count: { $sum: 1 } } }
//         ],
//         total: [
//           {$match:{...reponsabilities}},
//           { $count: "totalTickets" }
//         ],
//         assigned: [
//           { $match: { "assignedTo.userId": { $ne: null },...reponsabilities } },
//           { $count: "assignedTickets" }
//         ],
//         formName:[
//            {$match:{...reponsabilities}},
//           { $group: { _id: "$formName", count: { $sum: 1 } } }
//         ],
//         emmiter:[
//            {$match:{...reponsabilities}},
//           { $group: { _id: "$emitterOrganizationId", count: { $sum: 1 } } }
//         ],
//         recipient:[
//            {$match:{...reponsabilities}},
//           { $group: { _id: "$recipientOrganizationId", count: { $sum: 1 } } }
//         ]
//       }
//     }
//   ]);
// if(!stats)return res.status(404).json({message:"stat not found"});
//   return res.status(200).json({message:"success",data:stats});
//     } catch (error) {
//       console.log(error);
//       return res.status(500).json({message:"server error",error});
      
      
//     }
// };
// export const getDashboardStats=async(req:Request,res:Response)=>{
//   try {
//       const user=getToken(req);
//    if(!user)return res.status(404).json({message:"there is no user"});
//    const reponsabilities=getResponsablitiesFilterFromRole(user) 
//     const [stats] = await ticketModel.aggregate([
//   { $match: { ...reponsabilities } },
//   {
//     $facet: {
//       byStatus: [
//         { $group: { _id: "$status", count: { $sum: 1 } } }
//       ],
//       byPriority: [
//         { $group: { _id: "$priority", count: { $sum: 1 } } }
//       ],
//       total: [
//         { $count: "totalTickets" }
//       ],
//       assigned: [
//         { $match: { "assignedTo.userId": { $ne: null } } },
//         { $count: "assignedTickets" }
//       ],
//       formName: [
//         { $group: { _id: "$formName", count: { $sum: 1 } } }
//       ],
//       emmiter: [
//         {
//           $lookup: {
//             from: "organisations",
//             localField: "emitterOrganizationId",
//             foreignField: "_id",
//             as: "emitterOrg"
//           }
//         },
//         { $unwind: "$emitterOrg" },
//         {
//           $group: {
//             _id: "$emitterOrg._id",
//             name: { $first: "$emitterOrg.name" },
//             count: { $sum: 1 }
//           }
//         }
//       ],
//       recipient: [
//         {
//           $lookup: {
//             from: "organisations",
//             localField: "recipientOrganizationId",
//             foreignField: "_id",
//             as: "recipientOrg"
//           }
//         },
//         { $unwind: "$recipientOrg" },
//         {
//           $group: {
//             _id: "$recipientOrg._id",
//             name: { $first: "$recipientOrg.name" },
//             count: { $sum: 1 }
//           }
//         }
//       ]
//     }
//   }
// ]);

//   if(!stats)return res.status(404).json({message:"stat not found"});
//   return res.status(200).json({message:"success",data:stats});
//      } catch (error) {
//        console.log(error);
//        return res.status(500).json({message:"server error",error});
      
      
//     }
// }
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const user = getToken(req);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const reponsabilities = getResponsablitiesFilterFromRole(user);

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
          formName: [
            { $group: { _id: "$formName", count: { $sum: 1 } } }
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


