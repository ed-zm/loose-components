import React, { createContext, useReducer, FunctionComponent } from "react";
import reducer from "./reducers";
import * as actionsForm from "./actions";
import actionsCreator from "../../../utils/actionsCreator";

interface ModalContextInitialValue {
  open?: boolean;
  modal: string;
  title: string;
  params?: object;
  style?: ViewStyle;
  actions?: Actions;
}

type Actions = {
  openModal(object: ModalContextInitialValue): void;
  closeModal(): void;
};

const initialValue: ModalContextInitialValue = {
  open: false,
  modal: "",
  title: "",
  params: {},
  actions: {
    openModal: () => {},
    closeModal: () => {}
  }
};

export const ModalContext = createContext(initialValue);

export const ModalProvider: FunctionComponent = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialValue);
  const actions = actionsCreator(actionsForm, dispatch);
  return <ModalContext.Provider value={{ ...state, actions }}>{children}</ModalContext.Provider>;
};
