export const ApiPath = {
  //Authenticate
  LOGIN: getDefaultPath("users/login"),
  GOOGLE_LOGIN_UI: getDefaultPath('users/auth/google'),
  GOOGLE_LOGIN: getDefaultPath("users/auth/google/callback"),
  SIGNUP: getDefaultPath("users/signup"),
  SEND_EMAIL: getDefaultPath("users/forgotPassword"),
  VERIFY_OTP: getDefaultPath("users/verifyOTP"),
  VERIFY_EMAIL: getDefaultPath("users/verifyEmail"),
  RESET_PASSWORD: getDefaultPath("users/changePassword"),

  //User
  GET_USER_INFO: getDefaultPath('users'),
  UPDATE_USER: getDefaultPath('users/updateUser'),
  DEACTIVATE_USER: getDefaultPath('users/deactivateAccount'),
  ACTIVATE_USER: getDefaultPath('users/activateAccount'),
  CREATE_USER: getDefaultPath('users'),

  //EventType
  GET_EVENT_TYPE_LIST: getDefaultPath('eventTypes'),
  UPDATE_EVENT_TYPE: getDefaultPath('eventTypes/updateEventType'),
  ACTIVATE_EVENT_TYPE: getDefaultPath('eventTypes/activateEventType'),
  DEACTIVATE_EVENT_TYPE: getDefaultPath('eventTypes/deactivateEventType'),

  //Event
  GET_EVENT_LIST: getDefaultPath('events'),
  GET_EVENT_DETAIL: getDefaultPath('events/getEventDetail'),
  UPLOAD_IMAGE: getDefaultPath('events/upload'),
  DEACTIVATE_EVENT:getDefaultPath('events/deactivateEvent'),
  ACTIVATE_EVENT: getDefaultPath('events/activateEvent'),
  UPDATE_EVENT: getDefaultPath('events/updateEvent'),
  CREATE_EVENT: getDefaultPath('events'),

  //Ticket
  GET_TICKETS: getDefaultPath('tickets'),
  UPDATE_TICKET: getDefaultPath('tickets/updateTicket'),
  DEACTIVATE_TICKET: getDefaultPath('tickets/deactivateTicket'),
  ACTIVATE_TICKET: getDefaultPath('tickets/activateTicket'),
  ADD_TICKET: getDefaultPath('tickets'),

  //Dashboard
  GET_PROFIT: getDefaultPath('bills/getRevenueList'),
  GET_VIEWS: getDefaultPath('events/getViewList'),
  GET_TICKET_SALES: getDefaultPath('bills/getTotalAmountTicketList'),

  //Transaction
  GET_TRANSACTIONS: getDefaultPath('bills'),
  GET_BILL_DETAIL: getDefaultPath('bills/getBillDetail'),
  CREATE_BILL: getDefaultPath('bills'),
  MOMO_PAID: getDefaultPath('bills/momo'),

  // Feedbacks
  SEND_FEEDBACK: getDefaultPath('feetbacks'),
  GET_FEEDBACKS_LIST: getDefaultPath('feetbacks'),
};

function getDefaultPath(path) {
  return `${process.env.NEXT_PUBLIC_API_ENDPOINT}/${path}`;
}
  
export default ApiPath;
  