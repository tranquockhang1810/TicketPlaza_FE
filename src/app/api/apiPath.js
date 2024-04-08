export const ApiPath = {
  //Authenticate
  LOGIN: getDefaultPath("users/login"),
  GOOGLE_LOGIN: getDefaultPath("users/auth/google/callback"),
  SIGNUP: getDefaultPath("users/signup"),

  //User
  GET_USER_INFO: getDefaultPath('users'),

  //EventType
  GET_EVENT_TYPE_LIST: getDefaultPath('eventTypes'),
  UPDATE_EVENT_TYPE: getDefaultPath('eventTypes/updateEventType'),
  ACTIVATE_EVENT_TYPE: getDefaultPath('eventTypes/activateEventType'),
  DEACTIVATE_EVENT_TYPE: getDefaultPath('eventTypes/deactivateEventType'),

  //Event
  GET_EVENT_LIST: getDefaultPath('events'),
  DEACTIVATE_EVENT:getDefaultPath('events/deactivateEvent'),
  ACTIVATE_EVENT: getDefaultPath('events/activateEvent'),
  UPDATE_EVENT: getDefaultPath('events/updateEvent'),
};

function getDefaultPath(path) {
  return `${process.env.NEXT_PUBLIC_API_ENDPOINT}/${path}`;
}
  
export default ApiPath;
  