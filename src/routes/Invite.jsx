
import '../scss/main.scss';
import icon from "../images/Umeko-Icon.png";
import { useEffect, useContext } from 'react';
import { GlobalAppContext } from '../contexts';

function Invite() {

  const { navigate } = useContext(GlobalAppContext);

  useEffect(() => {
    const changePage = () => {
      let newTab = window.open();
      newTab.location.href = 'https://discord.com/api/oauth2/authorize?client_id=804165876362117141&permissions=8&scope=bot%20applications.commands';
      navigate('../', { replace: true });
    }

    const timeout = setTimeout(changePage, 5000);
    const clearChange = () => { clearTimeout(timeout); }

    return clearChange;
  })


  return (
    <section className='standard-page' id="invite">
      <img src={icon} alt="Logo"/>
      <h1>Thanks for the Invite</h1>
    </section>
  );



}

export default Invite;