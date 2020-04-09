import actions from "./constants";

export const setUser = dispatch => payload => dispatch({ type: actions.SET_USER, payload });
export const logout = dispatch => payload => dispatch({ type: actions.LOGOUT, payload });
