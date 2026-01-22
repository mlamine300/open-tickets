export const API_ENDPOINT = import.meta.env.VITE_BACKEND_URL||"http://localhost:5001";
export const API_PATH = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    GET_PROFILE: "/api/auth/profile",
    LOGOUT: "/api/auth/logout",
  },
  USERS: {
    GET_ALL_USERS: "/api/users",
    GET_USER_BY_ID: (userID: string) => `/api/users/${userID}`,
    CREATE_USER: "/api/users/new",
    UPDATE_USER: (userID: string) => `/api/users/${userID}`,
    DELETE_USER: (userID: string) => `/api/users/${userID}`,
  },
  FORMS:{
    GET_FORMS:'/api/forms',
    GET_FORM_BY_ID:(id:string)=>`/api/forms/${id}`,
     EDIT_FORM_BY_ID:(id:string)=>`/api/forms/${id}`,
     ADD_FORM:"/api/forms",
     DELETE_FORM:(id:string)=>`/api/forms/${id}`,
     UPDATE_FORM_BY_ID:(id:string)=>`/api/forms/${id}`
  },
  ORGANISATIONS:{
    GET_ALL_ORGANISATIONS:'/api/organisations',
    GET_ORGANISATION_BY_ID:(id:string)=>`/api/organisations/${id}`
  },
  TICKETS:{
    //GET_ALL_TICKETS:"/api/tickets",
    GET_SPECIFIC_TICKETS:(type:string)=>`/api/tickets/list/${type}`,
     ADD_TICKET:"/api/tickets",
      GET_TICKET:"/api/tickets",
        GET_TICKET_BY_ID:(id:string)=>`/api/tickets/${id}`,
      GET_MY_TICKETS:(status:string)=>`/api/tickets/me/${status}`,
      TAKE_IN_CHARGE:(id:string)=>`/api/tickets/take_in_charge/${id}`,
      CLOSE_TICKET:(id:string)=>`/api/tickets/close/${id}`,
      REOPEN_TICKET:(id:string)=>`/api/tickets/relance/${id}`,
      ADD_ORGANISATION:(id:string)=>`/api/tickets/add_organisation/${id}`
     
     
  },
  COMMENT:{ADD_COMMENT:(id:string)=>`/api/comments/${id}`,GET_COMMENTS_OF_TICKETS:(id:string)=>`/api/comments/${id}`},
  
  ATTACHEMENT: {
    UPLOAD: "/api/attachement/upload",
  },
  REPORTS:{
    NOT_COMPLETE:'api/tickets/reports/notcomplete',
    REPORT_FROM_DATES:"api/tickets/reports/date"
  }
};
