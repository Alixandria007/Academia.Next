import React from "react"
import {globalState} from "./data"
import {reducer} from './reducer'
import {createContext, useReducer} from "react"

export const GlobalContext = createContext(null)

export const AppContext = ({children}) => {
    const [state, dispatch] = useReducer(reducer, globalState)
    
    return(
        <GlobalContext.Provider value={{state, dispatch}}>
            {children}
        </GlobalContext.Provider>
    )
}