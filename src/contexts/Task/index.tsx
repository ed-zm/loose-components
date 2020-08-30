import React, { createContext, useReducer } from "react";
import rootReducer from "./reducers";
import * as actionsForm from "./actions";
import actionsCreator from "../../utils/actionsCreator";

export interface TaskDraft {
  team: string;
  title: string,
  estimated: number;
  description: string;
  teamTask: boolean;
  organization: string;
  assignTo: string;
}

export interface TaskContextType {
  draft: TaskDraft
  actions: {
    setDraft(
      { team,
        title,
        estimated,
        description,
        teamTask,
        organization,
        assignTo
      }: TaskDraft
    ): void;
  };
}

const initialState: TaskContextType = {
  draft: {},
  actions: {
    setDraft: () => null
  }
};

export const TaskContext = createContext<TaskContextType>(initialState);

export const TaskProvider = ({ children, user }) => {
  const [state, dispatch] = useReducer(rootReducer, { ...initialState, ...user });
  const actions = actionsCreator(actionsForm, dispatch);
  return <TaskContext.Provider value={{ ...state, actions }}>{children}</TaskContext.Provider>;
};
