import { createContext } from 'react';

export const GlobalAppContext = createContext(
    {
        auth: {}, 
        setAuth : (auth) => {},
        navigate: () => {}
    });