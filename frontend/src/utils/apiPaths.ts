export const API_ENDPOINT = "http://localhost:5000";
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
    CREATE_USER: "/api/users",
    UPDATE_USER: (userID: string) => `/api/users/${userID}`,
    DELETE_USER: (userID: string) => `/api/users/${userID}`,
  },
  FORMS:{
    GET_FORM_BY_ID:(id:string)=>`/api/forms/${id}`,
     ADD_FORM:"/api/forms",
     UPDATE_FORM_BY_ID:(id:string)=>`/api/forms/${id}`
  },
  ORGANISATIONS:{
    GET_ALL_ORGANISATIONS:'/api/organisations',
    GET_ORGANISATION_BY_ID:(id:string)=>`/api/organisations/${id}`
  },
  TICKETS:{
    GET_ALL_TICKETS:"/api/tickets",
     ADD_TICKET:"/api/tickets",
     ADD_COMMENT:(id:string)=>`/${id}/comment`
  },
  // TASK: {
  //   GET_DASHBOARD_DATA: "/api/tasks/dashboard-data",
  //   GET_USER_DASHBOARD_DATA: "/api/tasks/user-dashboard-data",
  //   GET_ALL_TASKS: "/api/tasks",
  //   CREATE_TASK: "/api/tasks",
  //   GET_TASK_BY_ID: (taskId: string) => `/api/tasks/${taskId}`,
  //   UPDATE_TASK: (taskId: string) => `/api/tasks/${taskId}`,
  //   DELETE_TASK: (taskId: string) => `/api/tasks/${taskId}`,
  //   UPDATE_TASK_STATUS: (taskId: string) => `/api/tasks/${taskId}/status`,
  //   UPDATE_TASK_CHECKLIST: (taskId: string) => `/api/tasks/${taskId}/todo`,
  // },
  // REPORTS: {
  //   EXPORT_TASKS: "/api/reports/export/tasks",
  //   EXPORT_USERS: "/api/reports/export/users",
  // },
  IMAGE: {
    UPLOAD: "/api/auth/upload-image",
  },
};
