import { Request, Response } from "express";
import ticketModel from "../models/Ticket.js";
import organisationModel from "../models/Organisation.js";
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
        //   specialFields:1,
        //   attachement:1,
          motif:1,
          
          creator: "$creator.name",
          emitterOrganization: "$emitterOrganization.name",
          recipientOrganization: "$recipientOrganization.name",
          
            lastCommentAuthor: "$lastComment.author.name",
            lastCommentMessage: "$lastComment.message",
            lastCommentAction: "$lastComment.action",
            lastCommentCreatedAt: "$lastComment.createdAt",
        
        assignedTo: {
            $let: {
              vars: {
                a: { $cond: [{ $isArray: "$assignedTo" }, { $arrayElemAt: ["$assignedTo", 0] }, "$assignedTo"] }
              },
              in: { $cond: [{ $eq: ["$$a", null] }, null, { date: "$$a.date", user: { _id: "$$a.user._id", name: "$$a.user.name", email: "$$a.user.email" } }] }
            }
          }
      },
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
export const getTicketReportForBi = async (req: Request, res: Response) => {
  try {
    
    console.log("fetching data to bi")
    const toDay=new Date();
   const firstAtyear=new Date(toDay.getFullYear(),1,1)
   
    

    const dateFilter = {
     createdAt: {
    $gte: firstAtyear,
    $lte: toDay
  }
    }
    

    
    const pipeline:any[]=getPipline({match: {
          ...dateFilter,
        },limit:10000})

    
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
        console.log(result[0].data);
    return res.status(200).json({
       tickets:result[0]?.data ?? [],
      
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
};

export const getNotCompleteReportBi = async (req: Request, res: Response) => {
  try {
    

    
    const yesterDay = new Date();
    yesterDay.setHours(0, 0, 0, 0);

    // ================= FILTERS =================
   
  
    
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
    { ...notCompleteFilter } // this also includes $or
  ]
        }
      ,limit:1000
      })
   
      const result = await ticketModel.aggregate(pipeline).exec();

    return res.status(200).json({
      
      tickets: result[0]?.data ?? [],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
};

export const getOrganisationBi=async(req:Request,res:Response)=>{
    try {
        const organisations=await organisationModel.find({}).lean().exec();
    return res.status(200).json(organisations)
    } catch (error) {
     return res.status(500).json({message:"server Error"})   
    }
}
export const getUsersBi=async(req:Request,res:Response)=>{

    try {
        const users=await userModel.find({},{ role:1,email:1,name: 1, _id: 1,activeStatus:1,organisation:1,createdAt:1 }).populate("organisation","name").lean().exec();
        return res.status(200).json(users)
    } catch (error) {
        return res.status(500).json({message:"server Error"})  
    }
}