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
    id: "01",
    label: "DashBoard",
    icon: LuLayoutDashboard,
    path: "/form",
    hasChilds:false
  },
  {
    id: "02",
    label: "My Tickets",
    icon: LuClipboardCheck,
    path: "/tickets",
    hasChilds:true,
    childs:[
      {
      id:"21",
      label: "Tickets en attente",
      icon: LuClipboardCheck,
      path: "/tickets/pending",

    },
     {
      id:"22",
      label: "Prêt en charge par moi ",
      icon: LuClipboardCheck,
      path: "/tickets/open_me",

    },
        {
      id:"23",
      label: "Ticket ouvert ",
      icon: LuClipboardCheck,
      path: "/tickets/open",

    },
    {
      id:"24",
      label: "Ticket clôturés ",
      icon: LuClipboardCheck,
      path: "/tickets/closed",

    },
    {
      id:"25",
      label: "Ticket clôturés ",
      icon: LuClipboardCheck,
      path: "/tickets/closed",

    },
  ],
  

  },
   {
      id:"03",
      label: "Ticket envoyés",
      icon: LuClipboardCheck,
      path: "/tickets/sent",
      hasChilds:true,
    childs:[
      {
      id:"31",
      label: "En attente",
      icon: LuClipboardCheck,
      path: "/tickets/sent/pending",
      },
       {
      id:"32",
      label: "Ouvert",
      icon: LuClipboardCheck,
      path: "/tickets/sent/open",
      },
       {
      id:"33",
      label: "Clôturés",
      icon: LuClipboardCheck,
      path: "/tickets/sent/closed",
      },
    ]

    },
  {
    id: "06",
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
    path: "/form",
    hasChilds:false

  },
  {
    id: "02",
    label: "My Tickets",
    icon: LuClipboardCheck,
    path: "/tickets",
    hasChilds:true,
    childs:[
      {
      id:"21",
      label: "Tickets en attente",
      icon: LuClipboardCheck,
      path: "/tickets/pending",

    },
     {
      id:"22",
      label: "Prêt en charge par moi ",
      icon: LuClipboardCheck,
      path: "/tickets/open_me",

    },
        {
      id:"23",
      label: "Ticket ouvert ",
      icon: LuClipboardCheck,
      path: "/tickets/open",

    },
    {
      id:"24",
      label: "Ticket clôturés ",
      icon: LuClipboardCheck,
      path: "/tickets/closed",

    },
   
  ],
  

  },
   {
      id:"03",
      label: "Ticket envoyés",
      icon: LuClipboardCheck,
      path: "/tickets/sent",
      hasChilds:true,
    childs:[
      {
      id:"31",
      label: "En attente",
      icon: LuClipboardCheck,
      path: "/tickets/sent/pending",
      },
       {
      id:"32",
      label: "Ouvert",
      icon: LuClipboardCheck,
      path: "/tickets/sent/open",
      },
       {
      id:"33",
      label: "Clôturés",
      icon: LuClipboardCheck,
      path: "/tickets/sent/closed",
      },
    ]

    },
  {
    id: "06",
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
      {name:"ref",label:"Ref/Tracking",type:"text",required:false},
      {name:"priority",label:"priorité",type:"select",possibleValues:PRIORITY_DATA.map(x=>x.value),required:false},
      {name:"message",label:"Message",type:"text",possibleValues:PRIORITY_DATA.map(x=>x.value),required:true},
      // {name:"status",label:"status de réclamation",type:"select",possibleValues:STATUS_DATA.map(x=>x.value),required:false},
        {name:"organisationDest",label:"organisation Destinataire",type:"select",possibleValues:organisations.map(o=>o.name),required:false},
        {name:"organisationTag",label:"organisation Taguée",type:"select",possibleValues:organisations.map(o=>o.name),required:false},
    ]
    