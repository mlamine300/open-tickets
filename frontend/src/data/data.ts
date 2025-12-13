import {
  LuClipboardCheck,
  LuLayoutDashboard,
  LuLogOut,
  LuPlus,
} from "react-icons/lu";
import type { FormType, FormFieldType } from "../../../types";
import { HiFolder } from "react-icons/hi2";
import { BookmarkCheck, CheckCheck, LayoutList, Loader, Plus } from "lucide-react";
import { FaTools, FaWpforms } from "react-icons/fa";
import { check } from "zod";

export const SIDE_MENU_ADMIN_DATA = [
  {
    id: "01",
    label: "Tableau de bord",
    icon: LuLayoutDashboard,
    path: "/",
  },
   {
    id: "01",
    label: "Ajouter un Ticket",
    icon: Plus,
    path: "/form",
    hasChilds:false
  },
  {
    id: "02",
    label: "Mes Tickets",
    icon: LayoutList,
    path: "/tickets",
    hasChilds:true,
    childs:[
      {
      id:"21",
      label: "Tickets en attente",
      icon: Loader,
      path: "/tickets/pending",

    },
     {
      id:"22",
      label: "Pris en charge par moi",
      icon: FaTools,
      path: "/tickets/open_me",

    },
        {
      id:"23",
      label: "Ticket ouvert ",
      icon: BookmarkCheck,
      path: "/tickets/open",

    },
    {
      id:"24",
      label: "Ticket clôturés ",
      icon: CheckCheck,
      path: "/tickets/close",

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
      icon: Loader,
      path: "/tickets/sent/pending",
      },
       {
      id:"32",
      label: "Ouvert",
      icon: BookmarkCheck,
      path: "/tickets/sent/open",
      },
       {
      id:"33",
      label: "Clôturés",
      icon: CheckCheck,
      path: "/tickets/sent/close",
      },
    ]

    },
    {id:"05",
      label:"Formulaires",
      icon: FaWpforms,
      path:"/forms",
      hasChilds:true,
      childs:[
        {
          id:"51",
      label:"Formulaires",
      icon:FaWpforms,
      path:"/forms/list",
        },
        {
          id:"52",
      label:"Ajouter Formulaires",
      icon:LuPlus,
      path:"/forms/new",
        },
        
      ]

    },
  {
    id: "06",
    label: "Déconnecter",
    icon: LuLogOut,
    path: "/logout",
  },

];
export const SIDE_MENU_USER_DATA = [
  {
    id: "01",
    label: "Tableau de bord",
    icon: LuLayoutDashboard,
    path: "/",
    hasChilds:false

  },
   {
    id: "01",
    label: "Ajouter un Ticket",
    icon: Plus,
    path: "/form",
    hasChilds:false

  },
  {
    id: "02",
    label: "Mes Tickets",
    icon: LayoutList,
    path: "/tickets",
    hasChilds:true,
    childs:[
      {
      id:"21",
      label: "Tickets en attente",
      icon: Loader,
      path: "/tickets/pending",

    },
     {
      id:"22",
      label: "Pris en charge par moi",
      icon: FaTools,
      path: "/tickets/open_me",

    },
        {
      id:"23",
      label: "Ticket ouvert ",
      icon: BookmarkCheck,
      path: "/tickets/open",

    },
    {
      id:"24",
      label: "Ticket clôturés ",
      icon: CheckCheck,
      path: "/tickets/close",

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
      icon: Loader,
      path: "/tickets/sent/pending",
      },
       {
      id:"32",
      label: "Ouvert",
      icon: BookmarkCheck,
      path: "/tickets/sent/open",
      },
       {
      id:"33",
      label: "Clôturés",
      icon: CheckCheck,
      path: "/tickets/sent/close",
      },
    ]

    },
  {
    id: "06",
    label: "Déconnecter",
    icon: LuLogOut,
    path: "/logout",
  },
];

export const PRIORITY_DATA = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];
export const STATUS_DATA = [
  { label: "Pending", value: "Pending" },
  { label: "In Progress", value: "In Progress" },
  { label: "Completed", value: "Completed" },
];

export const standardForm=():FormType=>({
        _id:"standard",
        name:"standard",
        description:"reclamation standard",
        fields:StandartFierlds(),
    })


    export const StandartFierlds=():FormFieldType[]=>[
      {name:"ref",label:"Ref/Tracking",type:"text",required:true},
      {name:"priority",label:"priorité",type:"select",possibleValues:PRIORITY_DATA.map(x=>x.value),required:false,default:"low"},
      {name:"message",label:"Message",type:"text",possibleValues:PRIORITY_DATA.map(x=>x.value),required:true},
      // {name:"status",label:"status de réclamation",type:"select",possibleValues:STATUS_DATA.map(x=>x.value),required:false},
        {name:"organisationDest",label:"organisation Destinataire",type:"select-filter",possibleValues:[
                        "organisations"
                    ],required:false},
        {name:"organisationTag",label:"organisation Taguée",type:"select-multiple",possibleValues:["organisations"],required:false},
    ]

export const COMMENT_ACTIONS=["comment","in_charge","called","relancer","close"]

    export const COMMENT_ACTIONS_DICTIONNAIRE=
      {
      comment:"Commentaire",

  in_charge: "pris en charge",
  called: "le concerné a été appelé",
  relancer: "relancer",
  close:"traité"
}
    
    