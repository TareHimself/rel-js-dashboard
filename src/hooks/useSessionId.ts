import axios from 'axios';
import { useCallback, useEffect } from 'react';
import { setSessionId } from '../redux/slices/mainSlice'
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { DashboardConstants, utcInSeconds } from '../utils';
import { IUmekoApiResponse } from '../framework';

export default function useSessionId() {

    const sessionId = useAppSelector(s => s.main.sessionID);

    const dispatch = useAppDispatch();

    const updateSessionID = useCallback((newId: string | null) => {
        dispatch(setSessionId(newId))

    }, [dispatch])

    // poll the server to ensure this session is still valid
    useEffect(() => {

        if (!sessionId) {
            return undefined
        }

        const interval = setInterval(() => {

            const headers = { sessionId }

            axios.get<IUmekoApiResponse<number>>(`${DashboardConstants.SERVER_URL}/session-lifetime`, { headers: headers })
                .then((response) => {
                    const ServerResponse = response.data;
                    if (ServerResponse.error || (ServerResponse.data < utcInSeconds())) {
                        if (ServerResponse.error) console.log(ServerResponse.data)
                        updateSessionID(null);
                    }
                    else {

                    }
                }, (error) => {
                    updateSessionID(null);
                });
        }, 10000);

        return () => clearInterval(interval);

    }, [sessionId, updateSessionID]);

    return { sessionID: sessionId, updateSessionID };
}
