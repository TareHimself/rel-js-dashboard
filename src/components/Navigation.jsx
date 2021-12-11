import '../scss/main.scss';
import icon from "../images/UmekoIcon50px.png"
import User from './User'
import ThemeControl from './ThemeControl';

function Navigation() {
  return (
    <header id='Header' >
    <div className="navigation-column-right"><img src={icon} alt="Logo" /></div>
    <div className="navigation-column-left"><User /><ThemeControl /></div>
    </header>
  );
}

export default Navigation;

//<FontAwesomeIcon icon={faUser} size="2x" color="white" /> 