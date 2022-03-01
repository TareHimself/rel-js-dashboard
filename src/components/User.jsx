

import '../scss/main.scss';
import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useContext, useState } from 'react';
import { GlobalAppContext } from '../contexts';
import { BiChevronDown } from "react-icons/bi";
import { VscLoading } from 'react-icons/vsc';
import { v4 as uuidv4 } from 'uuid';
import { hashString } from '../utils';
import axios from 'axios';

const iconStyle = {
    margin: "0 10px",
    fontSize: "40px",
    verticalAlign: "middle"
}


function User() {

    

    const { theme, sessionId, setSessionId, serverLink,userData, setUserData,setIsCustomizingCard, debugging} = useContext(GlobalAppContext);

    
    let userAvatar = '';

    if(userData.avatar)
    {
        const extension = userData.avatar.startsWith("a_") ? 'gif' : 'png';
        userAvatar = `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.${extension}`
    }

    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {

        if (!sessionId || userAvatar) {
            return undefined
        }

        const headers = { sessionId: sessionId }

        axios.get(`${serverLink}/user`, { headers: headers })
            .then((response) => {
                const data = response.data;
                if (data.error) {
                    setSessionId('');
                    console.log(data.error);
                }
                else {
                    
                    setUserData(data);
                }

            }, (error) => {

                console.log(error);
            });

    }, [sessionId, setSessionId, setUserData,userAvatar, serverLink]);

    function onLogin(clickEvent){

        const stateId = uuidv4();

        localStorage.setItem('stateId', stateId);

        let stateHash = hashString(stateId);

        const params = new URLSearchParams({
            client_id : debugging ? '895104527001354313' : '804165876362117141',
            redirect_uri : `${window.location.origin}/auth`,
            response_type : 'code',
            scope : 'guilds identify',
            state : `${stateHash}`
        });

        const targetUrl = `https://discord.com/api/oauth2/authorize?${params.toString()}`;
        
        window.location.href = targetUrl;
    }

    function onLogout(clickEvent) {

        const data = { sessionId: sessionId }

        axios.post(`${serverLink}/destroy-session`, data)
            .then((response) => {
                console.log(response.data);   
                setSessionId('');
            }, (error) => {
                console.log(error);
                setSessionId('');
            });
    }

    function onClickLevelCard(clickEvent){
        setIsCustomizingCard(true);
    }

    useEffect(() => {
        const decideCloseMenu = function (clickEvent) {
            const dropdown = document.getElementById('user-menu-dropdown');
            const bounds = dropdown.getBoundingClientRect();

            if ((clickEvent.pageX > bounds.left && clickEvent.pageX < bounds.right) && (clickEvent.pageY > bounds.top && clickEvent.pageY < bounds.bottom)) return;

            setShowMenu(false);
        }

        if (showMenu) {
            window.addEventListener('click', decideCloseMenu);
        }
        else {
            window.removeEventListener('click', decideCloseMenu)
        }

        return () => window.removeEventListener('click', decideCloseMenu);

    }, [showMenu, setShowMenu]);

    if (sessionId) {
        if (userAvatar) {
            return (
                <div className='user-dropdown'>
                    <img className='user-avatar' src={userAvatar} alt='avatar'  />
                    < BiChevronDown className={`clickable-icons-${theme}`} style={iconStyle} onClick={() => setShowMenu(true)} />
                    {showMenu &&
                        <div id='user-menu-dropdown' className='user-dropdown-content'>
                            <button className='dropdown-button' onClick={onClickLevelCard} >Level Card</button>
                            <Link className='dropdown-button' to="/">Home</Link>
                            <Link className='dropdown-button' to="/servers">Servers</Link>
                            <Link className='dropdown-button' to="/commands">Commands</Link>
                            <Link className='dropdown-button' to="/privacy">Privacy Policy</Link>
                            <a className='dropdown-button' target='_blank' rel="noreferrer noopener" href="https://discord.gg/qx7eUVwTGY">Support</a>
                            <button className='dropdown-button' onClick={onLogout} >Log Out</button>
                        </div>}
                </div>
            );
        }
        else {
            return (
                <VscLoading className='loading-icon'/>
            );
        }
    }
    else {
        return (
            <div style={{
                display : "flex",
                alignItems : "center"
            }}>
                
                <button className="button" onClick={onLogin}> Login </button> 
                <div className='user-dropdown' >
                < BiChevronDown className={`clickable-icons-${theme}`} style={iconStyle} onClick={() => setShowMenu(true)} />
                {showMenu &&
                        
                        <div id='user-menu-dropdown' className='user-dropdown-content'>
                            <Link className='dropdown-button' to="/">Home</Link>
                            <Link className='dropdown-button' to="/commands">Commands</Link>
                            <Link className='dropdown-button' to="/privacy">Privacy Policy</Link>
                            <a className='dropdown-button' target='_blank' rel="noreferrer noopener" href="https://discord.gg/qx7eUVwTGY">Support</a>
                        </div>
                        }
                        </div>
            </div>

        );

    }


}

export default User;