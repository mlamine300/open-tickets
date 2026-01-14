import {
  LuClipboardCheck,
  LuLayoutDashboard,
  LuLogOut,
  LuPlus,
} from "react-icons/lu";
import type { FormType, FormFieldType } from "../../../types";

import { BookmarkCheck, CheckCheck, LayoutList, Loader, Plus, UserRoundPen, Users } from "lucide-react";
import { FaTools, FaWpforms } from "react-icons/fa";


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
    label: "Tickets Reçus",
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
      label: "Tickets envoyés",
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
    {id:"04",
      label:"Utilisateurs",
      icon: Users,
      path:"/users",
      hasChilds:true,
      childs:[
        {
          id:"41",
      label:"Modifier Utilisateur",
      icon:UserRoundPen,
      path:"/users/list",
        },
        {
          id:"52",
      label:"Ajouter Utilisateur",
      icon:LuPlus,
      path:"/users/new",
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
    label: "Tickets Reçus",
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
      label: "Tickets envoyés",
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
  { label: "Normal", value: "low" },
  { label: "Important", value: "medium" },
  { label: "Trés Important", value: "high" },
];
export const STATUS_DATA = [
  { value: "pending", label: "En attente" },
  { value: "open", label: "ouvert" },
  { value: "complete", label: "cloturé" },
];

export const getStandardForm=():FormType=>({
        _id:"standard",
        name:"standard",
        description:"reclamation standard",
        fields:StandartFierlds(),
    })


    export const StandartFierlds=():FormFieldType[]=>[
      {name:"ref",label:"Ref/Tracking/num",type:"text",required:true},
      {name:"priority",label:"priorité",type:"select",possibleValues:PRIORITY_DATA.map(x=>x.value),required:false,default:"low"},
      {name:"message",label:"Message",type:"text",possibleValues:PRIORITY_DATA.map(x=>x.value),required:true},
      // {name:"status",label:"status de réclamation",type:"select",possibleValues:STATUS_DATA.map(x=>x.value),required:false},
        {name:"organisationDest",label:"organisation Destinataire",type:"select-filter",possibleValues:[
                        "organisations"
                    ],required:false},
        {name:"organisationTag",label:"organisation Taguée",type:"select-multiple",possibleValues:["organisations"],required:false},
        {name:"attachement",label:"attachement",type:"file",required:false},
    ]

export const COMMENT_ACTIONS=["comment","in_charge","called","relancer","close"]

    export const COMMENT_ACTIONS_DICTIONNAIRE=
      {
      comment:"Commenter",

  in_charge: "Pris en charge",
  called: "Le concerné a été appelé",
  relancer: "Relancer",
  close:"Traiter",
  subscribe:"Ajouter une organisation"
}

export const getWilayas=()=>{
  return ['01 - Adrar',
'02 - Chlef',
'03 - Laghouat',
'04 - Oum El Bouaghi',
'05 - Batna',
'06 - Béjaïa',
'07 - Biskra',
'08 - Béchar',
'09 - Blida',
'10 - Bouira',
'11 - Tamanrasset',
'12 - Tébessa',
'13 - Tlemcen',
'14 - Tiaret',
'15 - Tizi Ouzou',
'16 - Alger',
'17 - Djelfa',
'18 - Jijel',
'19 - Sétif',
'20 - Saïda',
'21 - Skikda',
'22 - Sidi Bel Abbès',
'23 - Annaba',
'24 - Guelma',
'25 - Constantine',
'26 - Médéa',
'27 - Mostaganem',
'28 - MSila',
'29 - Mascara',
'30 - Ouargla',
'31 - Oran',
'32 - El Bayadh',
'33 - Illizi',
'34 - Bordj Bou Arreridj',
'35 - Boumerdès',
'36 - El Tarf',
'37 - Tindouf',
'38 - Tissemsilt',
'39 - El Oued',
'40 - Khenchela',
'41 - Souk Ahras',
'42 - Tipaza',
'43 - Mila',
'44 - Aïn Defla',
'45 - Naâma',
'46 - Aïn Témouchent',
'47 - Ghardaïa',
'48 - Relizane',
'49 - Timimoun',
'50 - Bordj Badji Mokhtar',
'51 - 	Ouled Djellal',
'52 - Beni Abbes',
'53 - In Salah',
'54 - In Guezzam',
'55 - 	Touggourt',
'56 - 	Djanet',
'57 - El MGhair',
'58 - El Meniaa',
]
}
    
    