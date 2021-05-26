import { createContext } from "react";
import { ApiContextProvider } from "../../types/ApiContextProvider";


export const ApiContext = createContext< ApiContextProvider | null>(null);
