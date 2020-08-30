import actions from "./constants";

export const setDraft = dispatch => payload => dispatch({ type: actions.SET_DRAFT, payload });
export const clearDraft = dispatch => payload => dispatch({ type: actions.CLEAR_DRAFT, payload });
