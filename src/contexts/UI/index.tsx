import React, { createContext } from 'react'
import { ModalProvider } from './Modal'

export const UIContext = createContext({})

export const UIProvider = ({ children }) => {
  return(
    <UIContext.Provider value={{}}>
      <ModalProvider>
       {children}
      </ModalProvider>
    </UIContext.Provider>
  )
}
