import actions from "./constants";

export default (state, action) => {
  switch (action.type) {
    case actions.SET_DRAFT:
      return {
        ...state,
        draft: action.payload
      };
    case actions.CLEAR_DRAFT:
      return {
        ...state,
        draft: {}
      }
    default:
      return state;
  }
};
