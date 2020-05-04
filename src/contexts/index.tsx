import React from "react";
import { UserProvider } from "./User";
import { UIProvider } from './UI'

export default ({ user, children }) => (
  <UserProvider user = { user }>
    <UIProvider>
      {children}
    </UIProvider>
  </UserProvider>
);
