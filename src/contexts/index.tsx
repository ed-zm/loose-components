import React from "react";
import { UserProvider } from "./User";
import { UIProvider } from './UI'
import { TaskProvider } from './Task'

export default ({ user, children }) => (
  <UserProvider user = { user }>
    <UIProvider>
      <TaskProvider>
        {children}
      </TaskProvider>
    </UIProvider>
  </UserProvider>
);
