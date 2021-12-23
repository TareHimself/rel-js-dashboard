import useWindowDimensions from '../hooks/useWindowDimensions';
import '../scss/main.scss';
import { BiMenuAltLeft } from 'react-icons/bi';
import User from './User'
import { useEffect } from 'react';

function Navigation() {

    const { width } = useWindowDimensions();

    const bShouldShowMenuIcon = (width <= 1200 && window.location.pathname === '/dashboard');
    console.log({width : width, status : bShouldShowMenuIcon})
    function onClickIcon(clickEvent) {
        if (document) {
            const dashboardSidebar = document.getElementById('dashboard-sidebar')
            if (dashboardSidebar && dashboardSidebar.getAttribute('is-open') !== 'true') {

                dashboardSidebar.style.width = '250px';
                dashboardSidebar.style.minWidth = '250px';
                dashboardSidebar.setAttribute('is-open', 'true');

                if (dashboardSidebar.getAttribute('event-bound') !== 'true') {
                    window.addEventListener('click', decideOnCloseDashSidebar, true);
                    dashboardSidebar.setAttribute('event-bound', 'true');
                }
            }
        }
    }

    function decideOnCloseDashSidebar(clickEvent) {
        const dashboardSidebar = document.getElementById('dashboard-sidebar');
        if(dashboardSidebar === null)
        {
            window.removeEventListener('click', decideOnCloseDashSidebar);
            return
        }
        const bounds = dashboardSidebar.getBoundingClientRect();

        if ((clickEvent.pageX > bounds.left && clickEvent.pageX < bounds.right) && (clickEvent.pageY > bounds.top && clickEvent.pageY < bounds.bottom)) return;

        if (dashboardSidebar.getAttribute('is-open') === 'true') {
            dashboardSidebar.style.width = '';
            dashboardSidebar.style.minWidth = '';
            dashboardSidebar.setAttribute('is-open', 'false');
        }


        window.removeEventListener('click', decideOnCloseDashSidebar);
        dashboardSidebar.setAttribute('event-bound', 'false');
    }

    useEffect(() => {
        function cleanUpPotentialLeak() {

            const dashboardSidebar = document.getElementById('dashboard-sidebar');

            if (dashboardSidebar) {
                if (dashboardSidebar.getAttribute('event-bound') === 'true') {
                    window.removeEventListener('click', decideOnCloseDashSidebar);
                }
            }
        }

        return cleanUpPotentialLeak;
    })



    return (
        <header id='Header' >
            <div className="navigation-column" pos='right'>{bShouldShowMenuIcon && <BiMenuAltLeft className='dashboard-menu-button' onClick={onClickIcon} />} </div>
            <div className="navigation-column" pos='left'><User /></div>
        </header>
    );
}

export default Navigation;