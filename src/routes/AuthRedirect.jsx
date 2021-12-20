import React from 'react';
import { useContext } from 'react';
import '../scss/main.scss';
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

  const { setSessionId, navigate,serverLink } = useContext(GlobalAppContext);

  let query = useQuery();

  const token = query.get("code");


  React.useEffect(() => {

    if(token === undefined)
    {
      navigate('../',{ replace: true });
      return undefined
    }

    axios.post(`${serverLink}/create-session`,{ token : token})
    .then((response) => {
      const data = response.data;
      if(data.sessionId !== undefined)
      {
        setSessionId(data.sessionId);
        navigate('../',{ replace: true });
      }
      else
      {
        navigate('../',{ replace: true });
      }
    }, (error) => {
      console.log(error);
      navigate('../',{ replace: true });
    });

  },[token,navigate,setSessionId,serverLink]);

  return (
    <section className='auth-page' id='Auth'>
      <h1>Authorizing</h1>
    </section>
  );
}

export default AuthRedirect;