import {io} from "socket.io-client";
import React from "react";
import URLS from "../utils/endpoint-urls";

const SOCKET_URL = URLS.BASE_URL;

export const socket = io(SOCKET_URL);

// app context
export const AppContext = React.createContext();