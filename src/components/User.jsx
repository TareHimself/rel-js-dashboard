

import '../scss/main.scss';
import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useContext, useState } from 'react';
import { GlobalAppContext } from '../contexts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { BiChevronDown } from "react-icons/bi";
import axios from 'axios';


const authURL = "https://discord.com/api/oauth2/authorize?client_id=804165876362117141&redirect_uri=http%3A%2F%2Fumeko.dev%2Fauth&response_type=code&scope=guilds%20identify";
function User() {
    const { theme, sessionId, setSessionId, serverLink } = useContext(GlobalAppContext);

    const [userAvatar, setUserAvatar] = useState('');

    const [showMenu, setShowMenu] = useState(false);

    const iconStyle = {
        margin: "0 10px",
        fontSize: "40px",
        verticalAlign: "middle"
    }

    useEffect(() => {

        if (sessionId === '' || userAvatar !== '') {
            return undefined
        }

        const headers = { sessionId: sessionId }

        axios.get(`${serverLink}/user`, { headers: headers })
            .then((response) => {
                const data = response.data;
                if (data.result === 'error') {
                    setSessionId('');
                    console.log(data.error);
                }
                else {
                    const extension = data.avatar.startsWith("a_") ? 'gif' : 'png';
                    setUserAvatar(`https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.${extension}`);
                }

            }, (error) => {

                console.log(error);
            });

    }, [sessionId, setSessionId, userAvatar, serverLink]);

    function onLogout(clickEvent) {
        const data = { sessionId: sessionId }

        axios.post(`${serverLink}/destroy-session`, data)
            .then((response) => {
                setSessionId('');
            }, (error) => {
                console.log(error);
                setSessionId('');
            });
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

    if (sessionId !== '') {
        if (userAvatar !== '') {
            return (
                <div className='user-dropdown'>
                    <img className='user-avatar' src={userAvatar} alt='avatar'  />
                    < BiChevronDown className={`clickable-icons-${theme}`} style={iconStyle} onClick={() => setShowMenu(true)} />
                    {showMenu &&
                        <div id='user-menu-dropdown' className='user-dropdown-content'>
                            <Link className='dropdown-button' to="/">Home</Link>
                            <Link className='dropdown-button' to="/servers">Servers</Link>
                            <Link className='dropdown-button' to="/commands">Commands</Link>
                            <Link className='dropdown-button' to="/support">Support</Link>
                            <button className='dropdown-button' onClick={onLogout} >log Out</button>
                        </div>}
                </div>
            );
        }
        else {
            return (
                <FontAwesomeIcon icon={faUser} />
            );
        }
    }
    else {
        return (
            <div style={{
                display : "flex",
                alignItems : "center"
            }}>
                
                <a className="button" href={authURL}> Login </a> 
                <div className='user-dropdown' >
                < BiChevronDown className={`clickable-icons-${theme}`} style={iconStyle} onClick={() => setShowMenu(true)} />
                {showMenu &&
                        
                        <div id='user-menu-dropdown' className='user-dropdown-content'>
                            <Link className='dropdown-button' to="/">Home</Link>
                            <Link className='dropdown-button' to="/commands">Commands</Link>
                            <Link className='dropdown-button' to="/support">Support</Link>
                        </div>
                        }
                        </div>
            </div>

        );

    }


}

export default User;