import '../scss/main.scss';
import { useContext } from 'react';
import { GlobalAppContext } from '../contexts';
import { FaLightbulb ,FaRegLightbulb} from 'react-icons/fa';

function ThemeControl() {

    const { theme, setTheme } = useContext(GlobalAppContext);

    const color = theme === "dark" ? "white" : "#ff0460";

    const iconStyle = {
        margin: "0 20px",
        fontSize: "31px",
        color: color
    }

   

    return (
        <div  onClick={() => setTheme( theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ?
                <FaRegLightbulb style={iconStyle} />
                : <FaLightbulb  style={iconStyle} />
            }

        </div>
    );
}

export default ThemeControl;