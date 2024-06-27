import React,{ createContext } from "react";
import runChat from "../config/Gemini";

export const Context = createContext()

const ContextProvider =(props)=>{
    
    const onSent = async (prompt)=>{
        await runChat(prompt)
    }
    
    onSent("What is React.js")
    const contextValue ={

    }
    return(
        <Context.Provider value={contextValue}>{props.children}</Context.Provider>
    )
}
export default ContextProvider;