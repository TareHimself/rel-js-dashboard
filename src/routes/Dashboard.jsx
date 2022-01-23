
import '../scss/main.scss';
import useQuery from '../hooks/useQuery';
import { GlobalAppContext } from '../contexts';
import { useContext, useEffect } from 'react';
import { GoGraph } from 'react-icons/go';
import { IoSettingsOutline, IoChevronBack,IoLogoTwitch } from 'react-icons/io5';
import { SiMonkeytie } from 'react-icons/si';
import { AiOutlineBug } from 'react-icons/ai';
import { BsDoorOpen } from 'react-icons/bs';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { useState } from 'react';
import axios from 'axios';

function Dashboard() {

    const query = useQuery();

    const { navigate, sessionId,serverLink } = useContext(GlobalAppContext);

    const { width } = useWindowDimensions();

    const [guildSettings,setGuildSettings] = useState(undefined);

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

        currentUrlParams.set('category', category);

        closeDashboardSidebar();

        navigate(window.location.pathname + "?" + currentUrlParams.toString(), { replace: true });
    }

    useEffect(() => {
        const category = query.get('category') || 'general';

        const dashboardSidebar = document.getElementById('dashboard-sidebar');
        if (dashboardSidebar) {
            const elements = dashboardSidebar.children;
            for (let i = 0; i < elements.length; i++) {

                const currentElement = elements[i];

                if (currentElement.id === (category + 'Category'))
                {
                    currentElement.setAttribute('class', 'dashboard-sidebar-button-selected')
                }
                else if(currentElement.getAttribute('class') !== 'dashboard-sidebar-button')
                {
                    currentElement.setAttribute('class', 'dashboard-sidebar-button')
                }
            }
        }

    }, [query])

    useEffect(() => {

        const guildId = query.get('guild');

        if(guildSettings || !guildId || !sessionId) return undefined;

          const headers = { sessionId: sessionId }
      
          axios.get(`${serverLink}/settings/${guildId}`, { headers: headers })
            .then((response) => {
      
                const data = response.data;
                setGuildSettings(data);
            }, (error) => {
              navigate('../', { replace: true });
              console.log(error);
            });

    }, [query,sessionId,serverLink,guildSettings,navigate])



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
                        <IoSettingsOutline className='dashboard-sidebar-icon' /><h3>Home</h3>
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
            <div className="dashboard-content">
                
            </div>

        </section>
    );

}

export default Dashboard;
