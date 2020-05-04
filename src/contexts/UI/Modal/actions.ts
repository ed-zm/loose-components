
import actions from "./constants";

export const openModal = dispatch => payload => dispatch({ type: actions.OPEN, payload });
export const closeModal = dispatch => payload => dispatch({ type: actions.CLOSE, payload });
