import actions from "./constants";

export default (state, action) => {
  switch (action.type) {
    case actions.OPEN:
      return { ...state, ...action.payload, open: true };
    case actions.CLOSE:
      return { ...state, open: false, params: {}, title: "", modal: "" };
    default:
      return state;
  }
};
