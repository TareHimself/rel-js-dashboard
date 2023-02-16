import '../scss/main.scss';
import React from 'react';
import { FaLightbulb, FaRegLightbulb } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setTheme } from '../redux/slices/mainSlice';

const THEME_ICON_STYLE = {
    margin: "0 10px",
    fontSize: "31px",
}

export default function ThemeControl() {

    const dispatch = useAppDispatch()
    const theme = useAppSelector(s => s.main.theme)



    return (
        <div onClick={() => dispatch(setTheme(theme === "dark" ? "light" : "dark"))}>
            {theme === "dark" ?
                <FaRegLightbulb className={`clickable-icons-${theme}`} style={THEME_ICON_STYLE} />
                : <FaLightbulb className={`clickable-icons-${theme}`} style={THEME_ICON_STYLE} />
            }
        </div>
    );
}