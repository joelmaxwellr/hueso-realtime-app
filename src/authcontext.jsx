import { Children, createContext, useContext } from "react";

export const authContext = createContext()

export function AuthProvider({children}){
    const user ={
        login:true
    }

    return <context.Provider value={{user}}>{children}</context.Provider>
}