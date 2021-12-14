import '../scss/main.scss';
import User from './User'

function Navigation() {
  return (
    <header id='Header' >
    <div className="navigation-column-right"></div>
    <div className="navigation-column-left"><User /></div>
    </header>
  );
}

export default Navigation;