import { USER_TYPES } from "../constants";

const setUsername = (username) => {
  return {
    type: USER_TYPES.SET_USERNAME,
    payload: {
      username: username,
    },
  };
};

const setUserLoginStatus = (status) => {
  return {
    type: USER_TYPES.SET_IS_LOGGED_IN,
    payload: {
      status: status,
    },
  };
};

const setUserProfileName = (name) => {
  return {
    type: USER_TYPES.SET_NAME,
    payload: {
      name: name,
    },
  };
};

const setUserPicture = (picture) => {
  return {
    type: USER_TYPES.SET_PICTURE,
    payload: {
      picture: picture,
    },
  };
};

const setUserOnlineStatus = (status) => {
  return {
    type: USER_TYPES.SET_STATUS,
    payload: {
      status: status,
    },
  };
};

const setUserPhoneNumber = (phoneNumber) => {
  return {
    type: USER_TYPES.SET_PHONENUMBER,
    payload: {
      phoneNumber: phoneNumber,
    },
  };
};

const setUserID = (_id) => {
  return {
    type: USER_TYPES.SET___ID,
    payload: {
      _id: _id,
    },
  };
};

const setUserNewMessages = (newMessages) => {
  return {
    type: USER_TYPES.SET_NEW_MESSAGES,
    payload: {
      newMessages: newMessages,
    },
  };
};

const addNotifications = (room) => {
  return {
    type: USER_TYPES.ADD_NOTIFICATIONS,
    payload: {
      room: room,
    },
  };
};

const resetNotifications = (room) => {
  return {
    type: USER_TYPES.RESET_NOTIFICATIONS,
    payload: {
      room: room,
    },
  };
};

export {
  setUsername,
  setUserLoginStatus,
  setUserOnlineStatus,
  setUserPicture,
  setUserProfileName,
  setUserPhoneNumber,
  setUserID,
  setUserNewMessages,
  addNotifications,
  resetNotifications,
};
