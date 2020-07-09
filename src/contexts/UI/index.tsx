import React, { createContext, useReducer, useEffect } from 'react'
import { ModalProvider } from './Modal'
import reducer from "./reducers";
import * as actionsForm from "./actions";
import actionsCreator from "../../utils/actionsCreator";

const breakpoint = width => {
  if (width > 1200) return "xxl";
  else if (width > 1000 && width < 1200) return "xl";
  else if (width > 800 && width < 1000) return "md";
  else if (width > 600 && width < 800) return "sm";
  else return "xs";
};

interface UIContextInitialValue {
  loading: boolean;
  width: number;
  height: number;
  bp: string;
}

type Actions = {
  openModal(object: ModalContextInitialValue): void;
  closeModal(): void;
};

const initialValue = {
  loading: false,
  width: Math.round(process.browser ? window.innerWidth : 0),
  height: Math.round(process.browser ? window.innerHeight : 0),
  bp: breakpoint(Math.round(process.browser ? window.innerWidth : 0)),
  actions: {
    loading: p => p,
    resize: p => p
  }
};

export const UIContext = createContext(initialValue)

export const UIProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialValue);
  const actions = actionsCreator(actionsForm, dispatch);
  // console.log('CONTEXT STATE', state)
  useEffect(() => {
    const resize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const bp = breakpoint(width);
      if (width) actions.resize({ height, width, bp });
    };
    //subscribe
    window.addEventListener("resize", resize);
    // unsubscribe
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);
  return(
    <UIContext.Provider value={{ ...state, actions }}>
      <ModalProvider>
       {children}
      </ModalProvider>
    </UIContext.Provider>
  )
}
