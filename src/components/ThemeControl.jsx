import '../scss/main.scss';
import { useContext } from 'react';
import { GlobalAppContext } from '../contexts';
import { FaLightbulb ,FaRegLightbulb} from 'react-icons/fa';

function ThemeControl() {

    const { theme, setTheme } = useContext(GlobalAppContext);

    const iconStyle = {
        margin: "0 10px",
        fontSize: "31px",
    }

   

    return (
        <div onClick={() => setTheme( theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ?
                <FaRegLightbulb  className={`clickable-icons-${theme}`} style={iconStyle}  />
                : <FaLightbulb className={`clickable-icons-${theme}`} style={iconStyle}   />
            }
        </div>
    );
}

export default ThemeControl;