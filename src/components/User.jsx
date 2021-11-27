

import '../scss/base.scss';
import React from 'react';
import { useEffect } from 'react';
import { useContext, useState } from 'react';
import { GlobalAppContext } from '../contexts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const authURL = "https://discord.com/api/oauth2/authorize?client_id=804165876362117141&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fredirect&response_type=code&scope=identify%20guilds"
function User() {
    const { sessionId, setSessionId } = useContext(GlobalAppContext);

    const [userAvatar, setUserAvatar] = useState('');

    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {

        if (sessionId === '' || userAvatar !== '') {
            return undefined
        }

        const headers = { sessionId: sessionId }
    
        axios.get("http://localhost:3500/user", { headers: headers })
            .then((response) => {
                const data = response.data;
                if (data.result === 'error') {
                    setSessionId('');
                    console.log(data.error);
                }
                else {
                    const extension = data.avatar.startsWith("a_") ? 'gif' : 'png';
                    setUserAvatar(`https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.${extension}`);
                    console.log(data);
                }

            }, (error) => {

                console.log(error);
            });

    }, [sessionId, setSessionId, userAvatar]);


    useEffect(() => {
        const decideCloseMenu = function (clickEvent) {
            const dropdown = document.getElementById('user-menu-dropdown');
            const bounds = dropdown.getBoundingClientRect();

            if((clickEvent.pageX > bounds.left && clickEvent.pageX < bounds.right) && (clickEvent.pageY > bounds.top && clickEvent.pageY < bounds.bottom)) return;

            setShowMenu(false);
        }

        if (showMenu) {
            window.addEventListener('click', decideCloseMenu);
        }
        else
        {
            window.removeEventListener('click', decideCloseMenu)
        }

        return () => window.removeEventListener('click', decideCloseMenu);

    }, [showMenu, setShowMenu]);

    let elementToRender = undefined;

    if (sessionId !== '') {
        if (userAvatar !== '') {
            return (
                <div className='user-dropdown'>
                    <img className='user-avatar' src={userAvatar} alt='avatar' onClick={()=> setShowMenu(true)}/>
                    {showMenu && <div id= 'user-menu-dropdown' className='user-dropdown-content'>
                        <h3>Item</h3>
                        <h3>Item</h3>
                        <h3>Item</h3>
                        <h3>Item</h3>
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
            <a className="button" href={authURL}> Login </a>
        );

    }


}

export default User;