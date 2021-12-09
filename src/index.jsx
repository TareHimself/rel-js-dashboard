import React from 'react';
import ReactDOM from 'react-dom';
import { useState, useEffect } from 'react';
import {
    BrowserRouter,
    Routes,
    Route,
    useNavigate
} from "react-router-dom";
import './scss/main.scss';
import { GlobalAppContext } from './contexts';

import Home from './routes/Home';
import Servers from './routes/Servers';
import Dashboard from './routes/Dashboard';
import Commands from './routes/Commands';
import AuthRedirect from './routes/AuthRedirect';
import Navigation from './components/Navigation';
import Invite from './routes/Invite';

import reportWebVitals from './reportWebVitals';
import axios from 'axios';



const App = () => {

    const serverLink = 'https://rel-js-server.oyintareebelo.repl.co';

    const [sessionId, setSessionIdRaw] = useState(localStorage.getItem('sessionId') || '');

    const setSessionId = function (id) {
        if (id === '') {
            localStorage.removeItem('sessionId');
        }
        else {
            localStorage.setItem('sessionId', id);
        }

        setSessionIdRaw(id);
    }

    let navigate = useNavigate();


    useEffect(() => {

        if (sessionId === '') {
            return undefined
        }

        const headers = { sessionId: sessionId }
        
        axios.get(serverLink, { headers: headers })
            .then((response) => {
                const data = response.data;
                if (data.result === 'error') {
                    setSessionId('');
                }
            }, (error) => {
                setSessionId('');
                console.log(error);
            });

    }, [sessionId]);



    return (
        <GlobalAppContext.Provider value={{ sessionId, setSessionId, navigate, serverLink  }}>
            <Navigation />

            <Routes>
                <Route path="umeko.oyintare.dev/" element={<Home />} />
                <Route path="umeko.oyintare.dev/invite" element={<Invite />} />
                <Route path="umeko.oyintare.dev/auth" element={<AuthRedirect />} />
                <Route path="umeko.oyintare.dev/commands" element={<Commands />} />
                <Route path="umeko.oyintare.dev/servers" element={<Servers />} />
                <Route path="umeko.oyintare.dev/dashboard" element={<Dashboard />} />
            </Routes>

        </GlobalAppContext.Provider>
    );
}
ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
    , document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
