import {
  LuClipboardCheck,
  LuLayoutDashboard,
  LuLogOut,
  LuSquarePlus,
  LuUser,
} from "react-icons/lu";
import type { FormType, FormFieldType, Organisation } from "../../../types";

export const SIDE_MENU_ADMIN_DATA = [
  {
    id: "01",
    label: "DashBoard",
    icon: LuLayoutDashboard,
    path: "/",
  },
  {
    id: "02",
    label: "Manage Tickets",
    icon: LuClipboardCheck,
    path: "/tickets",
  },
//   {
//     id: "03",
//     label: "Create Task",
//     icon: LuSquarePlus,
//     path: "/create-task",
//   },
//   {
//     id: "04",
//     label: "Team Members",
//     icon: LuUser,
//     path: "/users",
//   },
  {
    id: "05",
    label: "Logout",
    icon: LuLogOut,
    path: "/logout",
  },
];
export const SIDE_MENU_USER_DATA = [
  {
    id: "01",
    label: "DashBoard",
    icon: LuLayoutDashboard,
    path: "/",
  },
  {
    id: "02",
    label: "My Tickets",
    icon: LuClipboardCheck,
    path: "/tickets",
  },
  {
    id: "05",
    label: "Logout",
    icon: LuLogOut,
    path: "/logout",
  },
];
export const SIDE_MENU_SUPERVISOR_DATA=  [
  {
    id: "01",
    label: "DashBoard",
    icon: LuLayoutDashboard,
    path: "/",
  },
  {
    id: "02",
    label: "My Tickets",
    icon: LuClipboardCheck,
    path: "/tickets",
  },
  {
    id: "05",
    label: "Logout",
    icon: LuLogOut,
    path: "/logout",
  },
];
export const PRIORITY_DATA = [
  { label: "Low", value: "Low" },
  { label: "Medium", value: "Medium" },
  { label: "High", value: "High" },
];
export const STATUS_DATA = [
  { label: "Pending", value: "Pending" },
  { label: "In Progress", value: "In Progress" },
  { label: "Completed", value: "Completed" },
];

export const standardForm=(organisations:Organisation[]):FormType=>({
        _id:"standard",
        name:"standard",
        description:"reclamation standard",
        fields:StandartFierlds(organisations),
    })

// name:string;
//       label:string;
//       type:string;
//       possibleValues?:string[];
//     required:boolean;

    export const StandartFierlds=(organisations:Organisation[]):FormFieldType[]=>[
      {name:"priority",label:"priorité",type:"select",possibleValues:PRIORITY_DATA.map(x=>x.value),required:false},
      {name:"message",label:"Message",type:"text",possibleValues:PRIORITY_DATA.map(x=>x.value),required:true},
      // {name:"status",label:"status de réclamation",type:"select",possibleValues:STATUS_DATA.map(x=>x.value),required:false},
        {name:"organisationDest",label:"organisation Destinataire",type:"select",possibleValues:organisations.map(o=>o.name),required:false},
        {name:"organisationTag",label:"organisation Taguée",type:"select",possibleValues:organisations.map(o=>o.name),required:false},
    ]
    