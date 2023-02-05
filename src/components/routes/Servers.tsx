
import '../../scss/main.scss';
import { useEffect, useState } from 'react';
import GuildItem from '../GuidItem';
import axios from 'axios';
import useQuery from '../../hooks/useQuery';
import { BiSearchAlt } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { IGuildPartial } from '../../types';
import { useAppSelector } from '../../redux/hooks';
import Constants from '../../constants';

function Servers() {

  const query = useQuery();

  const navigate = useNavigate();
  const [sessionId] = useAppSelector(s => [s.main.sessionID])
  const [guilds, setGuilds] = useState<IGuildPartial[]>([]);
  const [filter, setFilter] = useState(query.get("s") || '');

  let guildElements: JSX.Element[] = [];

  if (guilds.length) {

    const guildsToShow = guilds.filter(function (guild) {
      const lowerName = guild.name.toLowerCase();
      const lowerFilter = filter.toLowerCase();

      if (lowerFilter.length === 0) return true;

      return lowerName.includes(lowerFilter);
    });

    guildElements = guildsToShow.map((guildData) => <GuildItem guild={guildData} key={guildData.id} />);
  }

  const handleSearchChange = function (changeEvent: any) {
    const currentUrlParams = query;

    currentUrlParams.set('s', changeEvent.target.value);

    navigate(window.location.pathname + "?" + currentUrlParams.toString(), { replace: true });

  }



  useEffect(() => {

    const searchBox = document.getElementById('search-input');

    if (searchBox) {
      searchBox.addEventListener("change", handleSearchChange);

      const removeListner = () => {

        const inputBox = document.getElementById('search-input');

        if (inputBox) inputBox.removeEventListener("change", handleSearchChange);
      }
      return removeListner;
    }

  });

  useEffect(() => {

    if (!sessionId) {
      return undefined;
    }

    if (query.get("s") !== undefined) {
      const searchBox = document.getElementById('search-input') as HTMLInputElement;

      if (!searchBox) return undefined;

      if (query.get("s") && query.get("s") !== '' && searchBox.value === '') {
        searchBox.value = query.get("s")!;
      }
    }

  });

  useEffect(() => {

    if (!sessionId || guilds) {
      return undefined;
    }

    const headers = { sessionId: sessionId }

    axios.get(`${Constants.SERVER_URL}/guilds`, { headers: headers })
      .then((response) => {

        const data = response.data;

        if (!data || !data.filter) return;

        setGuilds(data);
      }, (error) => {
        console.log(error);
      });

  });



  return (
    <section className='standard-page' id='Servers' style={{ "paddingTop": "100px" }}>

      <div className="search-container" >
        <input id='search-input' type="text" placeholder="Search.." value={filter} onChange={(event) => setFilter(event.target.value)} />
        <BiSearchAlt />
      </div>

      <div className='guild-items'>
        {guildElements}
      </div>

    </section>
  );

}

export default Servers;
