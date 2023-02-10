// import axios from 'axios';
import { useCallback } from 'react';
import { setSessionId } from '../redux/slices/mainSlice'
import { useAppDispatch, useAppSelector } from '../redux/hooks';
// import { DashboardConstants, utcInSeconds } from '../utils';
// import { IUmekoApiResponse } from '../framework';

export default function useSessionId() {

    const sessionId = useAppSelector(s => s.main.sessionID);

    const dispatch = useAppDispatch();

    const updateSessionID = useCallback((newId: string | null) => {
        dispatch(setSessionId(newId))
    }, [dispatch])

    // // poll the server to ensure this session is still valid
    // useEffect(() => {
    //     // const interval = setInterval(() => {

    //     //     const headers = { sessionId }

    //     //     axios.get<IUmekoApiResponse<number>>(`${DashboardConstants.SERVER_URL}//`, { headers: headers })
    //     //         .then((response) => {
    //     //             const ServerResponse = response.data;
    //     //             if (ServerResponse.error || (ServerResponse.data < utcInSeconds())) {
    //     //                 if (ServerResponse.error) console.log(ServerResponse.data)
    //     //                 updateSessionID(null);
    //     //             }
    //     //             else {

    //     //             }
    //     //         }, (error) => {
    //     //             updateSessionID(null);
    //     //         });
    //     // }, 10000);

    //     // return () => clearInterval(interval);

    //     const existingSession = localStorage.getItem(SESSION_STORAGE_KEY)
    //     if (existingSession && !sessionId) {
    //         dispatch(setSessionId(existingSession))
    //     }
    // }, [sessionId, updateSessionID, dispatch]);

    return { sessionId, updateSessionID };
}
