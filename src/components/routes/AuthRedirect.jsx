import React from 'react';
import { useContext } from 'react';
import '../../scss/main.scss';
import {
  useLocation
} from "react-router-dom";
import { GlobalAppContext } from '../../contexts';
import axios from 'axios';
import { VscLoading } from 'react-icons/vsc';
import { hashString } from '../../utils';

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function AuthRedirect() {

  const { sessionId , setSessionId, navigate,serverLink } = useContext(GlobalAppContext);

  let query = useQuery();

  const token = query.get("code");

  const state = query.get("state");


  React.useEffect(() => {

    function finishAuthentication(path,reason)
    {
      console.log(reason);
      window.location.search = '';
      window.location.pathname = path;
      return undefined;
    }

    if(!token || sessionId)
    {
      return undefined;      
    }

    if(!localStorage.getItem('stateId')) return finishAuthentication('/','no storage data found');

    const hashedStateId = `${hashString(localStorage.getItem('stateId'))}`;

    localStorage.removeItem('stateId');
    
    if(hashedStateId !== state) return finishAuthentication('/',`storage data hash does not match recieved hash ${hashedStateId} | ${state}`);

    axios.post(`${serverLink}/create-session`,{ token : token})
    .then((response) => {
      const data = response.data;
      if(data.sessionId)
      {
        setSessionId(data.sessionId);
        navigate(`/`);
        
      }
      else
      {
        navigate('/');
        console.log(data);
      }
    }).catch((error) => {
      console.log(error);
      finishAuthentication('/','an error occured');
    });

  },[token,state,navigate,setSessionId,sessionId,serverLink]);

  return (
    <section className='auth-page' id='Auth'>
      <VscLoading className='loading-icon'/>
    </section>
  );
}

export default AuthRedirect;