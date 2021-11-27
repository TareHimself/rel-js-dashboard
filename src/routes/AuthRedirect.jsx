import React from 'react';
import { useContext } from 'react';
import '../scss/auth.scss';
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

  const { setSessionId, navigate } = useContext(GlobalAppContext);

  let query = useQuery();

  const token = query.get("code");


  React.useEffect(() => {

    if(token === undefined)
    {
      navigate('/');
      return undefined
    }

    axios.post("http://localhost:3500/create-session",{ token : token})
    .then((response) => {
      const data = response.data;
      console.log(response);
      if(data.sessionId !== undefined)
      {
        setSessionId(data.sessionId);
        navigate('../',{ replace: true });
      }
    }, (error) => {
      console.log(error);
      navigate('../',{ replace: true });
    });

  },[token,navigate,setSessionId]);

  return (
    <section id='Auth'>
      <h1>Authorizing</h1>
    </section>
  );
}

export default AuthRedirect;