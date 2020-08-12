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
        id: "",
        username: "",
        firstName: "",
        lastName: "",
        avatar: "",
      };
    default:
      return state;
  }
};
