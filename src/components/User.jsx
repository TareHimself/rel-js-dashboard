

import '../scss/base.scss';
import React from 'react';
import { useContext } from 'react';
import { GlobalAppContext } from '../contexts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const authURL = "https://discord.com/api/oauth2/authorize?client_id=804165876362117141&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fredirect&response_type=code&scope=identify%20guilds"
function User() {
    const {authInfo} = useContext(GlobalAppContext);

    const isAuthenticated = Object.keys(authInfo).length !== 0;

    console.log(isAuthenticated)

    React.useEffect(() => {

        if(Object.keys(authInfo).length !== 0)
        {
            console.log("RETURNED")
          return undefined
        }

        console.log("OUUU")

        const data = new URLSearchParams({
            "Authorization": `Bearer ${authInfo}`,
            "Content-Type": "application/x-www-form-urlencoded" 
        });
    
        console.log(authInfo);
    
        /*const request = {
          method: 'POST',
    
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
    
          body: data
    
        };
    
    
        fetch("https://discordapp.com/api/oauth2/token", request)
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            setAuth(data);
            navigate('/');
          }).catch((error) => {
            console.log(error);
          });*/
    
      });

    if(isAuthenticated)
    {
        

        return(
            <FontAwesomeIcon icon={faUser} color="white" />
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