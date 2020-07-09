import actions from "./constants";

export default (state, action) => {
  switch (action.type) {
    case actions.LOADING:
      return { ...state, loading: action.payload };
    case actions.RESIZE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
