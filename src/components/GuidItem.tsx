import '../scss/main.scss';
import React from 'react';
import { Link } from 'react-router-dom';
import { IGuildPartial } from '../types';



function GuildItem({ guild }: { guild: IGuildPartial }) {

  const icon = (guild.icon !== null && guild.icon !== undefined) ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : 'https://www.howtogeek.com/wp-content/uploads/2021/07/Discord-Logo-Lede.png';

  return (
    <div className='guild-item'>
      <h3>{guild.name}</h3>
      <div className="guild-item-icon">
        <img src={icon} className="icon-background" alt="Server Icon" />
        <img src={icon} className="icon-forground" alt="Server Banner" />
      </div>
      <Link className='button' to={`/dashboard?g=${guild.id}&c=general`} >Dashboard</Link>
    </div>
  );
}

export default GuildItem;