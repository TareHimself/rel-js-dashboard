import '../scss/home.scss';
import '../scss/base.scss';
import User from './User'

function Navigation() {
  return (
    <header id='Header'>
    <div className="navigation-column-right"></div>
    <div className="navigation-column-left"><User /></div>
    </header>
  );
}

export default Navigation;

//<FontAwesomeIcon icon={faUser} size="2x" color="white" /> 