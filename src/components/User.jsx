

import '../scss/base.scss';
import React from 'react';
import { useEffect } from 'react';
import { useContext,useState } from 'react';
import { GlobalAppContext } from '../contexts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const authURL = "https://discord.com/api/oauth2/authorize?client_id=804165876362117141&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fredirect&response_type=code&scope=identify%20guilds"
function User() {
    const {sessionId, setSessionId} = useContext(GlobalAppContext);

    const [userAvatar, setUserAvatar] = useState('')
    const isAuthenticated = sessionId !== '';

    useEffect(() => {

        if (sessionId === '' || userAvatar !== '') {
            return undefined
        }


        axios.post("http://localhost:3500/user", { sessionId: sessionId })
            .then((response) => {
                const data = response.data;
                if (data.result === 'error') {
                    setSessionId('');
                    console.log(data.error);
                }
                else
                {
                    const extension = data.avatar.startsWith("a_") ? 'gif' : 'png';
                    setUserAvatar(`https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.${extension}`);
                    console.log(data);
                }

            }, (error) => {
                console.log(error);
            });

    }, [sessionId,setSessionId,userAvatar]);

    if(isAuthenticated)
    {
        return(
            <img className='user-avatar' src={userAvatar} alt='avatar'/>
        );   
    }
    else
    {
        return (
            <a className="button" href={authURL}> Login </a>
          );
    }
  
}

export default User;