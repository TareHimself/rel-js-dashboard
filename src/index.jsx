import React from 'react';
import ReactDOM from 'react-dom';
import { useState } from 'react';
import {
    BrowserRouter,
    Routes,
    Route,
    useNavigate
} from "react-router-dom";
import './scss/base.scss';
import { GlobalAppContext } from './contexts';
import Home from './routes/Home';
import AuthRedirect from './routes/AuthRedirect';
import Navigation from './components/Navigation';
import reportWebVitals from './reportWebVitals';



const App = () => {
    const [authInfo, setAuth] = useState({})

    let navigate = useNavigate();

    return (
        <GlobalAppContext.Provider value={{ authInfo, setAuth, navigate }}>
            <Navigation />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth/redirect" element={<AuthRedirect />} />
            </Routes>

        </GlobalAppContext.Provider>
    );
}
ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
