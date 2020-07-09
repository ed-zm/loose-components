import actions from "./constants";

export const loading = dispatch => payload => dispatch({ type: actions.LOADING, payload });
export const resize = dispatch => payload => dispatch({ type: actions.RESIZE, payload });
