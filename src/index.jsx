import React from 'react';
import ReactDOM from 'react-dom';
import { useState, useEffect } from 'react';
import {
    BrowserRouter,
    Routes,
    Route,
    useNavigate,
    useLocation
} from "react-router-dom";
import './scss/main.scss';
import { GlobalAppContext } from './contexts';
import { utcInSeconds } from './utils';

import Home from './routes/Home';
import Servers from './routes/Servers';
import Dashboard from './routes/Dashboard';
import Commands from './routes/Commands';
import AuthRedirect from './routes/AuthRedirect';
import Navigation from './components/Navigation';
import Invite from './routes/Invite';
import NotFound from './routes/NotFound';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';
import Support from './routes/Support';
import LevelCardCustomization from './components/LevelCardCustomization';
import { useCallback } from 'react';


const unProtectedLocations = ['home','invite','commands','auth','support'];

const App = () => {

    const debugging = false;

    const serverLink = debugging ? 'http://localhost:49154' : 'https://server.umeko.dev';

    let navigate = useNavigate();

    const location = useLocation();
    const actualLocation = location.pathname.substring(1).trim();
    const currentLocation = actualLocation !== '' ? actualLocation.charAt(0).toUpperCase() + actualLocation.slice(1) : '';

    const [theme, setTheme] = useState('dark');
    const [sessionId, setSessionIdRaw] = useState(localStorage.getItem('sessionId') || '');
    const [isCustomizingCard, setIsCustomizingCard] = useState(false);
    const [userData, setUserData] = useState({});


    const setSessionId = useCallback((id) => {
        if (!id) {

            if(currentLocation && !unProtectedLocations.includes(currentLocation)) navigate('/');

            setIsCustomizingCard(false);
            localStorage.removeItem('sessionId');
        }
        else {
            localStorage.setItem('sessionId', id);
        }

        setSessionIdRaw(id);
    },[currentLocation,navigate]);

    

    

    // poll the server to ensure this session is still valid
    useEffect(() => {

        if (sessionId === '') {
            return undefined
        }

        const interval = setInterval(() => {

            const headers = { sessionId: sessionId }

            axios.get(`${serverLink}/session-lifetime`, { headers: headers })
                .then((response) => {
                    const data = response.data;
                    if (data.error) {
                        setSessionId('');
                    }
                    else {
                        if (data.expire_at && data.expire_at < utcInSeconds()) {
                            setSessionId('');
                        }
                    }
                }, (error) => {
                    setSessionId('');
                });
        }, 10000);

        return () => clearInterval(interval);

    }, [sessionId, serverLink,setSessionId]);

    const darkTheme = {
        NavigationColor: '#42424',
        PrimaryColor: '#222222',
        SecondaryColor: '#161616',
        GuildItemsColor: '#424242',
        PrimaryTextColor: '#F7F7F7',
        ButtonColor: '#F7F7F7',
        ButtonHoverColor: '#ff0460'
    };

    const lightTheme = {
        NavigationColor: '#42424',
        PrimaryColor: '#FFFFFF',
        SecondaryColor: '#161616',
        GuildItemsColor: '#424242',
        PrimaryTextColor: '#F7F7F7',
        ButtonColor: '#F7F7F7',
        ButtonHoverColor: '#ff0460'
    };

    const themeColors = theme === 'dark' ? darkTheme : lightTheme;

    

    useEffect(() => {

        if (currentLocation === '') {
            document.title = 'Umeko | Home'
        }
        else {
            document.title = `Umeko | ${currentLocation}`
        }
    })
    return (
        <GlobalAppContext.Provider value={{ sessionId, serverLink, theme, themeColors, debugging, userData, setSessionId, navigate, setTheme, setUserData, setIsCustomizingCard }}>

            {isCustomizingCard && <LevelCardCustomization />}
            <Navigation />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/invite" element={<Invite />} />
                <Route path="/auth" element={<AuthRedirect />} />
                <Route path="/commands" element={<Commands />} />
                <Route path="/servers" element={<Servers />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/support" element={<Support />} />
                <Route path="*" element={<NotFound />} />
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
