import React from 'react';
import '../../scss/main.scss';
import {
  useLocation, useNavigate
} from "react-router-dom";
import axios from 'axios';
import { VscLoading } from 'react-icons/vsc';
import { DashboardConstants, hashString } from '../../utils';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setSessionId, setUserData } from '../../redux/slices/mainSlice';
import { IUmekoApiResponse } from '../../framework';
import { ILoginData } from '../../types';

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function AuthRedirect() {

  const [sessionId] = useAppSelector(s => [s.main.sessionID]);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  let query = useQuery();

  const token = query.get("code");

  const state = query.get("state");


  React.useEffect(() => {

    function finishAuthentication(path: string, reason: string) {
      console.log(reason);
      navigate({
        pathname: path,
        search: "",
      }, {
        replace: true
      });
      return undefined;
    }

    if (!token || sessionId) {
      return undefined;
    }

    if (!localStorage.getItem('stateId')) return finishAuthentication('/', 'Possibly invalid authentication');

    const hashedStateId = `${hashString(localStorage.getItem('stateId')!)}`;

    localStorage.removeItem('stateId');

    if (hashedStateId !== state) return finishAuthentication('/', `Storage data hash does not match recieved hash`);

    axios.post<IUmekoApiResponse<ILoginData>>(`${DashboardConstants.SERVER_URL}/login`, { token: token })
      .then((response) => {
        const ApiResponse = response.data

        if (!ApiResponse.error) {
          dispatch(setSessionId(ApiResponse.data.session))
          dispatch(setUserData({
            id: ApiResponse.data.user,
            username: ApiResponse.data.nickname,
            avatar: ApiResponse.data.avatar,
            card_opts: ApiResponse.data.card_opts
          }))
          console.log(ApiResponse.data)
          finishAuthentication('/', "Success");
        }
        else {
          finishAuthentication('/', ApiResponse.data);
        }


      }).catch((error) => {
        console.log(error);
        finishAuthentication('/', error.message);
      });

  }, [dispatch, navigate, sessionId, state, token]);

  return (
    <section className='auth-page' id='Auth'>
      <VscLoading className='loading-icon' />
    </section>
  );
}

export default AuthRedirect;