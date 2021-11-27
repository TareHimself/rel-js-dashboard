
import '../scss/home.scss';
import { useEffect,useContext } from 'react';
import { GlobalAppContext } from '../contexts';
import axios from 'axios';


function Home() {


  const { sessionId, navigate } = useContext(GlobalAppContext);

  useEffect(() => {

    if (sessionId === '') {
        return undefined
    }

    const headers = { sessionId: sessionId }

    axios.get("http://localhost:3500/guilds",{ headers: headers })
        .then((response) => {
          
            const data = response.data;
            console.log(data)
        }, (error) => {
            
            console.log(error);
        });

}, [sessionId]);

  return (
    <section id='Home'>
      <h1>Coming Soon...</h1>
    </section>
  );
}

export default Home;
