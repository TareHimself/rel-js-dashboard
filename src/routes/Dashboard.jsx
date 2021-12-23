
import '../scss/main.scss';
import { HiOutlineMenu } from 'react-icons/hi';
import { GoGraph } from 'react-icons/go';
import { IoSettingsOutline } from 'react-icons/io5';
import { SiMonkeytie } from 'react-icons/si'
import { AiOutlineBug } from 'react-icons/ai'

function Dashboard() {


  return (
    <section className='standard-page' id='Dashboard'>

      <div className="dashboard-sidebar">

        <div className="dashboard-sidebar-button">
          <div className="dashboard-sidebar-button-items">
            <HiOutlineMenu className='dashboard-sidebar-icon' /><h3>General</h3>
          </div>
        </div>

        <div className="dashboard-sidebar-button">
          <div className="dashboard-sidebar-button-items">
            <GoGraph className='dashboard-sidebar-icon' /><h3>Analytics</h3>
          </div>
        </div>

        <div className="dashboard-sidebar-button">
          <div className="dashboard-sidebar-button-items">
            <IoSettingsOutline className='dashboard-sidebar-icon' /><h3>Settings</h3>
          </div>
        </div>

        <div className="dashboard-sidebar-button">
          <div className="dashboard-sidebar-button-items">
            <SiMonkeytie className='dashboard-sidebar-icon' /><h3>Permissions</h3>
          </div>
        </div>

        <div className="dashboard-sidebar-button">
          <div className="dashboard-sidebar-button-items">
            <AiOutlineBug className='dashboard-sidebar-icon' /><h3>Bug Submissions</h3>
          </div>
        </div>

      </div>
      <div className="dashboard-content">
        <h1>Under Construction</h1>
      </div>

    </section>
  );

}

export default Dashboard;
