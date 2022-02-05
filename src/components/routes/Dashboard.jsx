
import '../../scss/main.scss';
import useQuery from '../../hooks/useQuery';
import { GlobalAppContext } from '../../contexts';
import { useContext, useEffect,useRef,useState } from 'react';
import { GoGraph } from 'react-icons/go';
import { IoSettingsOutline, IoChevronBack, IoLogoTwitch } from 'react-icons/io5';
import { SiMonkeytie } from 'react-icons/si';
import { AiOutlineBug } from 'react-icons/ai';
import { BsDoorOpen } from 'react-icons/bs';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import axios from 'axios';
import { GeneralCategory, JoinLeaveCategory, LevelingCategory, TwitchCategory, PermissionsCategory, BugsCategory } from '../dashboardCategories/dashboardCategories'

function Dashboard() {

    const query = useQuery();


    const { navigate, sessionId, serverLink } = useContext(GlobalAppContext);

    const { width } = useWindowDimensions();

    const guildData = useRef(undefined);

    const [guildSettings, setGuildSettings] = useState(undefined);

    function closeDashboardSidebar() {
        const dashboardSidebar = document.getElementById('dashboard-sidebar');
        if (dashboardSidebar && dashboardSidebar.getAttribute('is-open') === 'true') {
            dashboardSidebar.style.width = '';
            dashboardSidebar.style.minWidth = '';
            dashboardSidebar.setAttribute('is-open', 'false');
        }
    }

    function onSelectCategory(category) {

        const currentUrlParams = query;

        currentUrlParams.set('c', category);

        closeDashboardSidebar();

        navigate(window.location.pathname + "?" + currentUrlParams.toString(), { replace: true });
    }

    function updateGuildSettings(newSettings){
        setGuildSettings(newSettings);

        const guildId = query.get('g');

        if(!guildId) return;

        const headers = { sessionId: sessionId };

        axios.post(`${serverLink}/settings`,newSettings,{ headers: headers }).then((response)=>{
        }).catch(console.log);
    }


    useEffect(() => {
        const category = query.get('c') || 'general';

        const dashboardSidebar = document.getElementById('dashboard-sidebar');

        if (dashboardSidebar) {
            const elements = dashboardSidebar.children;
            for (let i = 0; i < elements.length; i++) {

                const currentElement = elements[i];

                if (currentElement.id === (category + 'Category')) {
                    currentElement.setAttribute('class', 'dashboard-sidebar-button-selected')
                }
                else if (currentElement.getAttribute('class') !== 'dashboard-sidebar-button') {
                    currentElement.setAttribute('class', 'dashboard-sidebar-button')
                }
            }
        }

    }, [query])

    useEffect(() => {

        const guildId = query.get('g');

        if (guildSettings || !guildId || !sessionId) return undefined;

        const headers = { sessionId: sessionId }

        axios.get(`${serverLink}/settings/${guildId}`, { headers: headers })
            .then((response) => {

                const data = response.data;
                guildData.current = data.guild;
                setGuildSettings(data.settings);
            }, (error) => {
                console.log(error);
            });

    }, [query, sessionId, serverLink, guildSettings, navigate]);

    function getDashboardContentElement(category) {

        const style = {
            paddingLeft : width <= 1200 ? "0px" : "250px"
        }
        switch (category) {
            case 'general':
                return <GeneralCategory style={style} guildData={guildData.current} settings={guildSettings} updateSettings={updateGuildSettings} />;

            case 'join-leave':
                return <JoinLeaveCategory style={style} guildData={guildData.current} settings={guildSettings} updateSettings={updateGuildSettings} />;

            case 'leveling':
                return <LevelingCategory style={style} guildData={guildData.current} settings={guildSettings} updateSettings={updateGuildSettings} />;

            case 'twitch':
                return <TwitchCategory style={style} guildData={guildData.current} settings={guildSettings} updateSettings={updateGuildSettings} />;

            case 'permissions':
                return <PermissionsCategory style={style} guildData={guildData.current} settings={guildSettings} updateSettings={updateGuildSettings} />;

            case 'bugs':
                return <BugsCategory style={style} guildData={guildData.current} settings={guildSettings} updateSettings={updateGuildSettings} />;

            default:
                break;
        }
    }

    return (
        <section className='standard-page' id='Dashboard'>

            <div className="dashboard-sidebar" id='dashboard-sidebar'>
                {width <= 1200 &&
                    <div className="dashboard-sidebar-button" onClick={() => closeDashboardSidebar()} style={{ margin: '15px 0' }}>
                        <div className="dashboard-sidebar-button-items">
                            <IoChevronBack className='dashboard-sidebar-icon' /><h1 style={{ fontSize: '25px' }}>Close</h1>
                        </div>
                    </div>
                }

                <div className="dashboard-sidebar-button" onClick={() => onSelectCategory('general')} id='generalCategory'>
                    <div className="dashboard-sidebar-button-items">
                        <IoSettingsOutline className='dashboard-sidebar-icon' /><h3>General</h3>
                    </div>
                </div>

                <div className="dashboard-sidebar-button" onClick={() => onSelectCategory('join-leave')} id='join-leaveCategory'>
                    <div className="dashboard-sidebar-button-items">
                        <BsDoorOpen className='dashboard-sidebar-icon' /><h3>Join/Leave</h3>
                    </div>
                </div>

                <div className="dashboard-sidebar-button" onClick={() => onSelectCategory('leveling')} id='levelingCategory'>
                    <div className="dashboard-sidebar-button-items">
                        <GoGraph className='dashboard-sidebar-icon' /><h3>Leveling</h3>
                    </div>
                </div>

                <div className="dashboard-sidebar-button" onClick={() => onSelectCategory('twitch')} id='twitchCategory'>
                    <div className="dashboard-sidebar-button-items">
                        <IoLogoTwitch className='dashboard-sidebar-icon' /><h3>Twitch</h3>
                    </div>
                </div>

                <div className="dashboard-sidebar-button" onClick={() => onSelectCategory('permissions')} id='permissionsCategory'>
                    <div className="dashboard-sidebar-button-items">
                        <SiMonkeytie className='dashboard-sidebar-icon' /><h3>Permissions</h3>
                    </div>
                </div>

                <div className="dashboard-sidebar-button" onClick={() => onSelectCategory('bugs')} id='bugsCategory'>
                    <div className="dashboard-sidebar-button-items">
                        <AiOutlineBug className='dashboard-sidebar-icon' /><h3>Bug Submissions</h3>
                    </div>
                </div>

            </div>

            {guildSettings && getDashboardContentElement(query.get('c') || 'general')}
            

        </section>
    );

}

export default Dashboard;
