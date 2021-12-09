import '../scss/main.scss';
import { Link } from 'react-router-dom';

function GuildItem(props) {

  console.log(props.guild);
    const icon = (props.guild.icon !== null && props.guild.icon !== undefined ) ? `https://cdn.discordapp.com/icons/${props.guild.id}/${props.guild.icon}.png` : 'https://www.howtogeek.com/wp-content/uploads/2021/07/Discord-Logo-Lede.png';

    const dashboardLink = props.guild.botShard !== undefined ? `/Dashboard?guild=${props.guild.id}` : "/invite";
  return (
    <div className='guild-item'>
        <h3>{props.guild.name}</h3>
        <div className="guild-item-icon">
        <img src={icon} className="icon-background" alt="Server Icon"/>
        <img src={icon} className="icon-forground" alt="Server Banner"/>
        </div>
        {props.guild.botShard !== undefined ? <Link className='button' to={dashboardLink} >Dashboard</Link> : <Link className='button' target="_blank" to={dashboardLink} >Invite</Link>}
        
    </div>
  );
}

export default GuildItem;