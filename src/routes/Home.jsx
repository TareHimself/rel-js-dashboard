
import '../scss/main.scss';
import icon from "../images/UmekoIcon500px.png";
import { useContext } from 'react';
import { GlobalAppContext } from '../contexts';

function Home() {

  return (
    <section className='standard-page' id='Home'>

      <div className="home-content-row">
        <img src={icon} alt="Logo" />
        <div className="home-content-row-info">
          <h1>Welcome</h1>
          <h3>Umeko is a multipurpose discord bot with commands for Music, Moderation , Anime, and Gaming, with more being added.</h3>
        </div>
      </div>


    </section>
  );

}

export default Home;
