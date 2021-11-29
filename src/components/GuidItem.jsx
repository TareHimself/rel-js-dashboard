import '../scss/main.scss';
import { Link } from 'react-router-dom';

function GuildItem(props) {

    const icon = props.guild.icon !== null ? `https://cdn.discordapp.com/icons/${props.guild.id}/${props.guild.icon}.jpg` : 'https://www.howtogeek.com/wp-content/uploads/2021/07/Discord-Logo-Lede.png'

    const dashboardLink = `/Dashboard?guild=${props.guild.id}`;
  return (
    <div className='guild-item'>
        <h3>{props.guild.name}</h3>
        <div className="guild-item-icon">
        <img src={icon} alt="Server Icon"/>
        </div>
        <Link className='button' to={dashboardLink} >Dashboard</Link>
    </div>
  );
}

export default GuildItem;