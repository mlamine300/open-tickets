
import { faker } from "@faker-js/faker";

import { COMMENT_ACTIONS } from "../utils/index.js";
import { commentsModel } from "../models/Comment.js";
import organisationModel from "../models/Organisation.js";
import userModel from "../models/User.js";
import ticketModel from "../models/Ticket.js";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import motifModel from "../models/Motifs.js";


const addUsers=async(organisations:any,userNumberToAdd:number)=>{
    const hashedPassword = await bcrypt.hash("open_ticket123*#", 10);
       let users=[];
      for (let i = 0; i < userNumberToAdd; i++) {
      const organisation =
        organisations[Math.floor(Math.random() * organisations.length)];
        const role= faker.helpers.arrayElement([
          ,
          "standard",
          "supervisor"
        ])
      const user = await userModel.create({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: hashedPassword,
        organisation: organisation._id,
        organisationsList: role==="supervisor"? faker.helpers.arrayElements(organisations.map((o:any) => o._id)) :[],
        role,
        activeStatus: true
      });
     

      users.push(user)
    }
   // await userModel.create(users);
    console.log("Users created");
    return users;
}

export const seedtickets = async (req:Request,res:Response) => {
  try {

    const motifs=await motifModel.find({}).lean().exec();
    let addedUsers=[] as any[];
    let addedTickets=[] as any[];

    // console.log("starting seeding")
    // config();
    const userNumberToAdd=req.body?.users??0;
    const ticketToAdd=req.body?.tickets??0;
    if(ticketToAdd<1)return res.status(404).json({message:"you should provide a number of tickets to add"});

    //  await connectToDB();

    // 🔥 CLEAN DB
    // await Promise.all([
    // ,
    //   ticketModel.deleteMany(),
    //   commentsModel.deleteMany()
    // ]);
   const organisations=await organisationModel.find({});
   
    
    if(userNumberToAdd>0)
    addedUsers= await addUsers(organisations,userNumberToAdd)
    const users =await userModel.find({}).lean().exec();
    


  

    

    for (let i = 0; i < ticketToAdd; i++) {
      const creator = faker.helpers.arrayElement(users);
      const emitterOrg = faker.helpers.arrayElement(organisations);
      const today=new Date();
      const createdAt=faker.date.between({from:new Date(2026,1,1),to:today} );
      const recipientOrg = faker.helpers.arrayElement(
        organisations.filter(o => o._id.toString() !== emitterOrg._id.toString())
      );
      const status=faker.helpers.arrayElement([
          "open",
          "pending",
          "traited",
          "complete"
        ]);
        
      const assignedUser = status==="pending"?null: faker.helpers.arrayElement(users);
        
      const ticket = await ticketModel.create({
        creator: creator._id,
        ref: `TCK-${faker.string.alphanumeric(6).toUpperCase()}`,
        emitterOrganizationId: emitterOrg._id,
        recipientOrganizationId: recipientOrg._id,
        associatedOrganizations: faker.helpers.arrayElements(
          organisations.map(o => o._id),
          2
        ),
        formName: faker.helpers.arrayElement([
          "Incident",
          "Reclamation",
          "Support Request"
        ]),
        status,
        priority: faker.helpers.arrayElement(["low", "medium", "high"]),
        motif: faker.helpers.arrayElement(motifs.map(m=>m.name)),
        message: faker.lorem.paragraph(),
        specialFields: {
          internalCode: faker.string.alphanumeric(8),
          category: faker.commerce.department()
        },
        assignedTo: !assignedUser?null: {
          userId: assignedUser._id,
          date: faker.date.between({from:createdAt,to:today} )
        },
        assignementHistory: !assignedUser?[]: [
          {
            
            userId: assignedUser._id,
            date: faker.date.past()
          }
        ],
        createdAt
      });

      addedTickets.push(ticket);
      // ===============================
      // 4️⃣ CREATE COMMENTS
      // ===============================

      const commentsCount = faker.number.int({ min: 1, max: 5 });
      const commentIds = [];

      for (let j = 0; j < commentsCount; j++) {
        const author = faker.helpers.arrayElement(users);

        const comment = await commentsModel.create({
        createdAt:faker.date.between({from:ticket.createdAt,to:today}),
          ticketId: ticket._id,
          authorId: author._id,
          ticketRef: ticket.ref,
          message: faker.lorem.sentences(2),
          action: faker.helpers.arrayElement(COMMENT_ACTIONS)
        });

        commentIds.push(comment._id);

        // update lastComment
        ticket.lastComment = comment;
      }

      ticket.comments = commentIds;
      console.log(ticket)
      
    }

    
    
    return res.status(200).json({message:"DATABASE SEEDED SUCCESSFULLY",users:addedUsers,tickets:addedTickets})
  } catch (err) {
    console.error(err);
   return res.status(500).json({message:"server error",error:err})
  }
};

// seed();

