import React from 'react';
import '../../scss/main.scss';
import {
  useLocation, useNavigate
} from "react-router-dom";
import axios from 'axios';
import { VscLoading } from 'react-icons/vsc';
import { DashboardConstants, hashString } from '../../utils';
import { useAppDispatch } from '../../redux/hooks';
import { setUserData } from '../../redux/slices/mainSlice';
import { IUmekoApiResponse } from '../../framework';
import { ILoginData } from '../../types';
import useSessionId from '../../hooks/useSessionId';

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function AuthRedirect() {

  const { sessionId, updateSessionID } = useSessionId()

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  let query = useQuery();


  React.useEffect(() => {

    function finishAuthentication(path: string, reason?: string) {
      navigate({
        pathname: path,
        search: "",
      }, {
        replace: true
      });

      if (reason) {
        console.error("Authentication Error:", reason)
      }
    }

    const token = query.get("code");

    const state = query.get("state");

    const stateId = localStorage.getItem('stateId')

    if (!token || sessionId || !stateId) {
      return undefined;
    }

    localStorage.removeItem('stateId');

    const hashedStateId = `${hashString(stateId)}`;

    if (hashedStateId !== state) return finishAuthentication('/', `Storage data hash does not match recieved hash`);

    axios.post<IUmekoApiResponse<ILoginData>>(`${DashboardConstants.SERVER_URL}/login`, { token: token })
      .then((response) => {
        const ApiResponse = response.data

        if (!ApiResponse.error) {
          updateSessionID(ApiResponse.data.session)
          dispatch(setUserData({
            id: ApiResponse.data.user,
            username: ApiResponse.data.nickname,
            avatar: ApiResponse.data.avatar,
            card_opts: ApiResponse.data.card_opts
          }))
          finishAuthentication('/');
        }
        else {
          console.error(ApiResponse.data)
          finishAuthentication('/', ApiResponse.data);
        }


      }).catch((error) => {
        console.error(error);
        finishAuthentication('/', error.message);
      })
  }, [dispatch, navigate, sessionId, updateSessionID, query]);

  return (
    <section className='auth-page' id='Auth'>
      <VscLoading className='loading-icon' />
    </section>
  );
}

export default AuthRedirect;