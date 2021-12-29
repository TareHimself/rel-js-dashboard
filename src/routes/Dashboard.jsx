
import '../scss/main.scss';
import useQuery from '../hooks/useQuery';
import { GlobalAppContext } from '../contexts';
import { useContext, useEffect } from 'react';
import { HiOutlineMenu } from 'react-icons/hi';
import { GoGraph } from 'react-icons/go';
import { IoSettingsOutline, IoChevronBack } from 'react-icons/io5';
import { SiMonkeytie } from 'react-icons/si'
import { AiOutlineBug } from 'react-icons/ai'
import DashboardSetting from '../components/DashboardSetting';
import useWindowDimensions from '../hooks/useWindowDimensions';

function Dashboard() {

    const query = useQuery();

    const { navigate } = useContext(GlobalAppContext);

    const { width } = useWindowDimensions();

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
        const category = query.get('category') || 'home';

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

                <div className="dashboard-sidebar-button" onClick={() => onSelectCategory('home')} id='homeCategory'>
                    <div className="dashboard-sidebar-button-items">
                        <HiOutlineMenu className='dashboard-sidebar-icon' /><h3>Home</h3>
                    </div>
                </div>

                <div className="dashboard-sidebar-button" onClick={() => onSelectCategory('analytics')} id='analyticsCategory'>
                    <div className="dashboard-sidebar-button-items">
                        <GoGraph className='dashboard-sidebar-icon' /><h3>Analytics</h3>
                    </div>
                </div>

                <div className="dashboard-sidebar-button" onClick={() => onSelectCategory('settings')} id='settingsCategory'>
                    <div className="dashboard-sidebar-button-items">
                        <IoSettingsOutline className='dashboard-sidebar-icon' /><h3>Settings</h3>
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
                <DashboardSetting/>
            </div>

        </section>
    );

}

export default Dashboard;
