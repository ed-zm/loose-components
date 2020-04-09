import React from "react";
import { UserProvider } from "./User";

export default ({ user, children }) => (
  <UserProvider user = { user }>
    {children}
  </UserProvider>
);
