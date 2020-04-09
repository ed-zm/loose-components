import React, { createContext, useReducer } from "react";
import rootReducer from "./reducers";
import * as actionsForm from "./actions";
import actionsCreator from "../../utils/actionsCreator";

export interface UserContextType {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  actions: {
    setUser({ sessionId, accessLevels }: { sessionId: string; accessLevels: [] }): void;
    logout(): void;
  };
}

const initialState: UserContextType = {
  id: "",
  username: "",
  firstName: "",
  lastName: "",
  actions: {
    setUser: () => null,
    logout: () => null
  }
};

export const UserContext = createContext<UserContextType>(initialState);

export const UserProvider = ({ children, user }) => {
  const [state, dispatch] = useReducer(rootReducer, { ...initialState, ...user });
  const actions = actionsCreator(actionsForm, dispatch);
  return <UserContext.Provider value={{ ...state, actions }}>{children}</UserContext.Provider>;
};
