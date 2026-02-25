import {
  LuClipboardCheck,
  LuLayoutDashboard,
  LuLogOut,
  LuPlus,
} from "react-icons/lu";
import { BsHouseAdd , BsHouses, BsHouseDoor   } from "react-icons/bs";
import type { FormType, FormFieldType } from "@/types";

import { BookmarkCheck, Check, CheckCheck, LayoutList, Loader, Megaphone, Plus, UserRoundPen, Users } from "lucide-react";
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
      label: "Ticket traités ",
      icon: Check,
      path: "/tickets/traited",

    },
    {
      id:"25",
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
      label: "Traités",
      icon: Check,
      path: "/tickets/sent/traited",
      },
       {
      id:"34",
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
      label:"Organisations",
      icon: BsHouseDoor ,
      path:"/organisations",
      hasChilds:true,
      childs:[
        {
          id:"51",
      label:"Modifier Organisation",
      icon:BsHouses,
      path:"/organisations/list",
        },
        {
          id:"52",
      label:"Ajouter Organisation",
      icon:BsHouseAdd,
      path:"/organisations/new",
        },
        
      ]

    },
    {id:"06",
      label:"Formulaires",
      icon: FaWpforms,
      path:"/forms",
      hasChilds:true,
      childs:[
        {
          id:"61",
      label:"Formulaires",
      icon:FaWpforms,
      path:"/forms/list",
        },
        {
          id:"62",
      label:"Ajouter Formulaires",
      icon:LuPlus,
      path:"/forms/new",
        },
        
      ]

    },
      {id:"07",
      label:"Annonce",
      icon: Megaphone,
      path:"/alert",
      hasChilds:false,
     

    },
  {
    id: "08",
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
      label: "Ticket traités ",
      icon: Check,
      path: "/tickets/traited",

    },
    {
      id:"25",
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
      label: "Traités",
      icon: Check,
      path: "/tickets/sent/traited",
      },
       {
      id:"34",
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

export const MOTIFS=[
  "Bureau injoignable - مكتب مُتعذِّر الوصول إليه",
"Bureau fermé - المكتب مغلق",
"Colis endommagé - طرد تالف",
"Colis manquant - طرد مفقود",
"Livraison manquante - تسليم مفقود",
"Retard de livraison - تأخر في التسليم",
"Retard de retour - تأخر في الإرجاع",
"Refus de livraison - رفض التسليم",
"Faux statut / Scan - حالة / مسح غير صحيح",
"Mauvais comportement - سوء السلوك",
"Ouverture sans autorisation - فتح بدون إذن",
"Demandes / Modifications - طلبات / تعديلات",
"Changement de prix - تغيير السعر",
"Changement de numéro - تغيير الرقم",
"Changement de commune - تغيير البلدية",
"Changement du type de livraison - تغيير نوع التسليم",
"Demande de localisation - طلب تحديد الموقع",
"Demande de mise à jour - طلب تحديث",
"Demande de livraison - طلب تسليم",
"Demande de retour - طلب إرجاع",
"Demande d’information - طلب معلومات",
"Conserver le colis / Garder le colis - الاحتفاظ بالطرد",
"Réclamation financière - شكوى مالية",
"Autre réclamation - شكوى أخرى",
"Surfacturation - فواتير زائدة",
"Réacheminement - إعادة التوجيه",
"Faux dispatch - توزيع خاطئ",
"accélération de livraison - تسريع التسليم",
"retour vide - إرجاع فارغ",
"litige et remboursement - نزاع واسترجاع الأموال",
"manque de prefessionnalisme - نقص الاحترافية",
"colis vide - طرد فارغ",
"Colis non validé - طرد غير مُعتمد",
"Colis non dispatché - طرد غير مُوزَّع",
"Navette saturée - الشاحنة ممتلئة",
"Colis double - طرد مكرر",
"Reçu par erreur - تم الاستلام عن طريق الخطأ",


]

export const getStandardForm=():FormType=>({
        _id:"standard",
        name:"standard",
        description:"reclamation standard",
        fields:StandartFierlds(),
    })


    export const StandartFierlds=():FormFieldType[]=>[
      {name:"motif",label:"Motif",type:"select-filter",possibleValues:MOTIFS,required:true},
      {name:"ref",label:"Ref/Tracking/num",type:"text",required:true},
        // {name:"status",label:"status de réclamation",type:"select",possibleValues:STATUS_DATA.map(x=>x.value),required:false},
        {name:"organisationDest",label:"organisation Destinataire",type:"select-filter",possibleValues:[
                        "organisations"
                    ],required:true},
        {name:"organisationTag",label:"organisation Taguée",type:"select-multiple",possibleValues:["organisations"],required:false},
       {name:"priority",label:"priorité",type:"select",possibleValues:PRIORITY_DATA.map(x=>x.label),required:true,default:"Normal"},
    
        {name:"attachement",label:"attachement",type:"file",required:false},
        {name:"message",label:"Message",type:"area",possibleValues:PRIORITY_DATA.map(x=>x.value),required:true},
     
    
    ]

export const COMMENT_ACTIONS=["comment","in_charge","called","relancer","close","create"]

    export const COMMENT_ACTIONS_DICTIONNAIRE=
      {
      comment:"Commenter",
      create:"Créer",
  in_charge: "Pris en charge",
  called: "Le concerné a été appelé",
  relancer: "Relancer",
  close:"Clôturer",
   trait:"Traiter",
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
    
    