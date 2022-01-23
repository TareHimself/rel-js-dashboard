
import '../scss/main.scss';
import { useEffect, useContext, useState} from 'react';
import { GlobalAppContext } from '../contexts';
import GuildItem from '../components/GuidItem';
import axios from 'axios';
import useQuery from '../hooks/useQuery';
import { BiSearchAlt } from 'react-icons/bi';

function Servers() {

  const query = useQuery();

  const { sessionId, navigate,serverLink } = useContext(GlobalAppContext);
  const [guilds, setGuilds] = useState(undefined);

  const guildsFilter = query.get("filter") || '';
  

  if (sessionId === '') {
    navigate('../', { replace: true });
  }

  let guildElements = <div></div>

  if (guilds && guilds.map) {

    guildElements = guilds.map((guildData) => <GuildItem guild={guildData} key={guildData.id} />);
  }

  const handleSearchChange = function (changeEvent) {
    const currentUrlParams = query;

    currentUrlParams.set('filter', changeEvent.target.value);

    navigate(window.location.pathname + "?" + currentUrlParams.toString(), { replace: true });

  }

  

  useEffect(() => {

    const searchBox = document.getElementById('server-search-input');

    searchBox.addEventListener("change", handleSearchChange);

    const removeListner = () => {

      const inputBox = document.getElementById('server-search-input');
      
      if(inputBox) inputBox.removeEventListener("change", handleSearchChange);
    }
    return removeListner; 

  });

  useEffect(() => {

    if (!sessionId) {
      return undefined;
    }

    if(query.get("filter") !== undefined)
    {
      const searchBox = document.getElementById('server-search-input');
      
      if(!searchBox) return undefined;

      if(query.get("filter") !== '' && searchBox.value === '')
      {
        searchBox.value = query.get("filter");
      }
    }

  });

  useEffect(() => {

    if (!sessionId || guilds) {
      return undefined;
    }

    const headers = { sessionId: sessionId }

    axios.get(`${serverLink}/guilds`, { headers: headers })
      .then((response) => {

        function isPartOfSearch(value) {
          const lowerName = value.name.toLowerCase();
          const lowerFilter = guildsFilter.toLowerCase();

          if(lowerFilter.length === 0) return true;

          return lowerName.includes(lowerFilter);
        }
        
        const data = response.data;
        
        if(!data|| !data.filter) return;
        
        const filteredData = data.filter(isPartOfSearch)
        setGuilds(filteredData);
      }, (error) => {
        navigate('../', { replace: true });
        console.log(error);
      });

  });

  

  return (
    <section className='standard-page' id='Servers' style={{ "paddingTop": "100px" }}>

      <div className="servers-search" >
        <input id='server-search-input' type="text" placeholder="Search.."  />
        <BiSearchAlt/>
      </div>

      <div className='guild-items'>
        {guildElements}
      </div>

    </section>
  );

}

export default Servers;
