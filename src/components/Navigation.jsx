import '../scss/main.scss';
import icon from "../images/Umeko-Icon.png"
import User from './User'

function Navigation() {
  return (
    <header id='Header' >
    <div className="navigation-column-right"><img src={icon} alt="Logo" /></div>
    <div className="navigation-column-left"><User /></div>
    </header>
  );
}

export default Navigation;

//<FontAwesomeIcon icon={faUser} size="2x" color="white" /> 