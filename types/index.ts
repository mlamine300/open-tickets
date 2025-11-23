/*
 name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    organisation:{type:Schema.Types.ObjectId,ref:"Organisation" , required:true},
    organisationsList:[{type:Schema.Types.ObjectId,ref:"Organisation"}],
    role: { type: String, enum: ["admin", "standard","supervisor"], default: "standard" },
    refreshTokens: [RefreshTokenSchema],
    activeStatus: { type: Boolean, default: true },
*/

export interface User {
  _id?: string;
  name: string;
  email: string;
  organisation: string;
  organisationsList?: string[];
  password?: string;
  role?: string;
  tokenC: string;
  createdAt?: Date;
  activeStatus?: boolean;
}
export interface Form{_id:string;
  name:string;
  description:string;
    fields:{
      name:string;
      label:string;
      type:string;
      possibleValue?:[]}}
export type priorityLevel = "Low" | "Medium" | "High";
export type statusType = "Pending" | "In Progress" | "Completed";


// export interface TaskLine {
//   _id: string;
//   status: statusType;
//   title: string;
//   priority: priorityLevel;
//   createdAt: Date;
// }
// export interface TodoType {
//   text: string;
//   completed?: boolean | true;
// }
// export interface Task {
//   _id?: string;
//   title: string;
//   description: string;
//   priority?: "Low" | "Medium" | "High";
//   status?: "Pending" | "In Progress" | "Completed";
//   dueDate: Date;
//   assignedTo: User[];
//   createdBy?: string;
//   attachments?: string[];
//   todoChecklist: TodoType[];
//   progress?: number;
// }
