import '../scss/home.scss';
import '../scss/base.scss';
import User from './User'

function Navigation() {
  return (
    <header id='Header'>
    <div className="navigation-column-right"><h1>REL</h1></div>
    <div className="navigation-column-left"><User /></div>
    </header>
  );
}

export default Navigation;

//<FontAwesomeIcon icon={faUser} size="2x" color="white" /> 