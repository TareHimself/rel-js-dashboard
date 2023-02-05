import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUserServerData } from "../../types";

const SESSION_ID_STORAGE_KEY = 'session'

export interface IMainData {
    theme: string;
    sessionID: string | null;
    isCustomizingCard: boolean;
    user: null | IUserServerData;
}

const initialState: IMainData = {
    theme: "dark",
    sessionID: null,
    isCustomizingCard: false,
    user: null,
}

const mainSlice = createSlice({
    name: 'main',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setSessionId: (state, action: PayloadAction<string | null>) => {
            state.sessionID = action.payload;
            if (!action.payload) {
                localStorage.removeItem(SESSION_ID_STORAGE_KEY)
            }
            else {
                localStorage.setItem(SESSION_ID_STORAGE_KEY, action.payload)
            }
        },
        setCustomizingCard: (state, action: PayloadAction<boolean>) => {
            state.isCustomizingCard = action.payload;
        },
        setTheme: (state, action: PayloadAction<string>) => {
            state.theme = action.payload;
        },
        setUserData: (state, action: PayloadAction<IUserServerData | null>) => {
            state.user = action.payload
        },
        updateUser: (state, action: PayloadAction<Partial<IUserServerData>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload }
            }
        }
    },
    extraReducers: (builder) => {

    }
})

export const { setSessionId, setCustomizingCard, setTheme, setUserData, updateUser } = mainSlice.actions
export default mainSlice.reducer