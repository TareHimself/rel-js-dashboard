import React from 'react';
import { useContext } from 'react';
import '../scss/home.scss';
import {
  useLocation
} from "react-router-dom";
import { GlobalAppContext } from '../contexts';
import axios from 'axios';

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function AuthRedirect() {

  const { authInfo, setAuth, navigate } = useContext(GlobalAppContext);

  let query = useQuery();

  const token = query.get("code");


  React.useEffect(() => {

    if(token === undefined || Object.keys(authInfo).length !== 0)
    {
      navigate('/');
      return undefined
    }

    const data = new URLSearchParams({
      'client_id': '804165876362117141',
      'client_secret': 'SO9IJg1wE3qP7-7Fg1XuIQNH4J0xqWnm',
      'grant_type': 'authorization_code',
      'code': token,
      'redirect_uri': 'http://localhost:3000/auth/redirect'
    });

    const request = {
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
      .then(function (responseJson) {
        setAuth(responseJson);
      }).catch((error) => {
        console.log(error);
      });

  });

  return (
    <section id='Home'>
      <h1>{query.get("code")}</h1>
    </section>
  );
}

export default AuthRedirect;