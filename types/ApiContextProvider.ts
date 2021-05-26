import { Dispatch, SetStateAction } from "react";
import { ClientToken } from "./ClientToken";

export interface ApiContextProvider {
  clientToken: ClientToken | null;
  setClientToken: Dispatch<SetStateAction<ClientToken | null>>;
  finish: boolean;
}