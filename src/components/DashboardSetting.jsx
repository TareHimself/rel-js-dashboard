import '../scss/main.scss';

const divStyle = {
    display : 'flex'    
}

function DasboardSetting() {


    return (
        <div style={divStyle}>
            <div className="dashboard-input-row">
                <h3>Prefix</h3>
                <input className='dasboard-text-input'/>
            </div>
        </div>
    );
}

export default DasboardSetting;