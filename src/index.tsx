import React from 'react';
import './scss/main.scss';
import ReactDOM from 'react-dom/client';
import { useEffect } from 'react';
import {
    BrowserRouter,
    Route,
    Routes,
    useLocation
} from "react-router-dom";
import Navigation from './components/Navigation';
import reportWebVitals from './reportWebVitals';
import LevelCardCustomization from './components/LevelCardCustomization';
import { Provider } from 'react-redux';
import { store } from './redux/store'
import { useAppSelector } from './redux/hooks'
import {
    AuthRedirect,
    Dashboard,
    Home,
    Invite,
    NotFound,
    Privacy,
    Servers,
    Support,
    TermsOfService
} from './components/routes/exports'


/*
<Route path="/" element={<Home />} />
<Route path="/invite" element={<Invite />} />
<Route path="/auth" element={<AuthRedirect />} />
<Route path="/servers" element={<Servers />} />
<Route path="/dashboard" element={<Dashboard />} />
<Route path="/support" element={<Support />} />
<Route path="/privacy" element={<Privacy />} />
<Route path="/terms" element={<TermsOfService />} />
<Route path="*" element={<NotFound />} />

*/

const App = () => {

    const location = useLocation();
    const actualLocation = location.pathname.substring(1).trim();
    const currentLocation = actualLocation !== '' ? actualLocation.charAt(0).toUpperCase() + actualLocation.slice(1) : '';

    const [theme, isCustomizingCard] = useAppSelector(s => [s.main.theme, s.main.isCustomizingCard])

    // const setSessionId = useCallback((id) => {
    //     if (!id) {

    //         if (currentLocation && !unProtectedLocations.includes(currentLocation)) navigate('/');

    //         setIsCustomizingCard(false);
    //         localStorage.removeItem('sessionId');
    //     }
    //     else {
    //         localStorage.setItem('sessionId', id);
    //     }

    //     setSessionIdRaw(id);
    // }, [currentLocation, navigate]);



    // useEffect(() => {

    //     if (currentLocation === '') {
    //         document.title = 'Home | Umeko'
    //     }
    //     else {
    //         document.title = `${currentLocation} | Umeko`;
    //     }
    // })


    useEffect(() => {
        //document.getElementById('#root')!.setAttribute('data-theme', theme);
    }, [theme])

    return (
        <>
            {isCustomizingCard && <LevelCardCustomization />}
            <Navigation />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/invite" element={<Invite />} />
                <Route path="/auth" element={<AuthRedirect />} />
                <Route path="/servers" element={<Servers />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/support" element={<Support />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}
const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
