import actions from "./constants";

export default (state, action) => {
  switch (action.type) {
    case actions.SET_USER:
      return {
        ...state,
        ...action.payload
      };
    case actions.LOGOUT:
      return {
        sessionId: null,
        timezone: null,
        language: null
      };
    default:
      return state;
  }
};
