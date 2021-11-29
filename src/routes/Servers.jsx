
import '../scss/main.scss';
import { useEffect, useContext, useState,useMemo } from 'react';
import {
  useLocation
} from "react-router-dom";
import { GlobalAppContext } from '../contexts';
import GuildItem from '../components/GuidItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

function Servers() {

  const query = useQuery();

  const { sessionId, navigate } = useContext(GlobalAppContext);
  const [guilds, setGuilds] = useState([]);

  const guildsFilter = query.get("filter") || '';
  

  if (sessionId === '') {
    navigate('../', { replace: true });
  }

  let guildElements = <div></div>

  if (guilds.map !== undefined) {

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
      
      if(inputBox !== undefined && inputBox !== null) inputBox.removeEventListener("change", handleSearchChange);
    }
    return removeListner; 

  });

  useEffect(() => {

    if (sessionId === '') {
      return undefined
    }

    if(query.get("filter") !== undefined)
    {
      const searchBox = document.getElementById('server-search-input');
      
      if(searchBox === undefined) return undefined;

      if(query.get("filter") !== '' && searchBox.value === '')
      {
        searchBox.value = query.get("filter");
      }
    }

  });

  useEffect(() => {

    if (sessionId === '') {
      return undefined
    }
    console.log('RAN')

    const headers = { sessionId: sessionId }

    axios.get("http://localhost:3500/guilds", { headers: headers })
      .then((response) => {

        function isPartOfSearch(value) {
          const lowerName = value.name.toLowerCase();
          const lowerFilter = guildsFilter.toLowerCase();

          if(lowerFilter.length === 0) return true;

          console.log(lowerName);
          console.log(lowerFilter)
          console.log(lowerName.includes(lowerFilter));
          console.log('\n')
          return lowerName.includes(lowerFilter);
        }
        
        const data = response.data;
        const filteredData = data.filter(isPartOfSearch)
        console.log(filteredData)
        setGuilds(filteredData);
      }, (error) => {
        navigate('../', { replace: true });
        console.log(error);
      });

  }, [sessionId, setGuilds, navigate,guildsFilter]);

  

  return (
    <section className='standard-page' id='Servers' style={{ "paddingTop": "100px" }}>

      <div className="servers-search" >
        <input id='server-search-input' type="text" placeholder="Search.."  />
        <FontAwesomeIcon icon={faSearch} />
      </div>

      <div className='guild-items'>
        {guildElements}
      </div>

    </section>
  );

}

export default Servers;
