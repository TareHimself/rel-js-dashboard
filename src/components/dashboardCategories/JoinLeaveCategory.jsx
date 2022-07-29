import { useRef, useState } from 'react';
import '../../scss/main.scss';
import DashboardTextInput from './DashboardTextInput';
import DashboardDropdownInput from './DashboardDropdownInput';
import { isEqual } from '../../utils';




const messageLocationOptions = ['disabled', 'current', 'dm', 'channel'];

const messageLeaveLocationOptions = ['disabled', 'channel'];


function getChannelName(id, lookup) {
    return lookup[id];
}

const messageLocationLookup = {
    disabled: 'Disabled',
    current: 'Current Channel',
    dm: 'Direct Message',
    channel: 'Specific Channel'
}

function getLocationSettingName(location, lookup) {
    return lookup[location];
}

function convertChannelsToObject(channels) {
    const object = {};
    channels.forEach(channel => object[channel.id] = channel.name);
    return object;
}

function JoinLeaveCategory({ style, guildData, settings, updateSettings }) {


    const settingsToModify = {
        welcome_options: new URLSearchParams(settings.welcome_options),
        leave_options: new URLSearchParams(settings.leave_options)
    }

    const [sectionSettings, setSectionSettings] = useState(settingsToModify);

    const channels = useRef(guildData.channels.map(channel => channel.id));

    const channelLookup = useRef(convertChannelsToObject(guildData.channels))

    const bHasBeenModified = !isEqual(settingsToModify, sectionSettings);

    function onResetCategory(event) {
        setSectionSettings({ ...settingsToModify });
    }

    function onSaveCategory(event) {
        updateSettings({ ...settings, ...sectionSettings, welcome_options: sectionSettings.welcome_options.toString(), leave_options: sectionSettings.leave_options.toString() });
    }

    function onWelcomeMsgChanged(value) {
        const options = sectionSettings.welcome_options;
        options.set('msg', value);
        setSectionSettings({ ...sectionSettings, welcome_options: options });
    }

    function onLeaveMsgChanged(value) {
        const options = sectionSettings.leave_options;
        options.set('msg', value);
        setSectionSettings({ ...sectionSettings, leave_options: options });
    }

    function onWelcomeLocationChanged(value) {
        const isSpecific = value[0] === messageLocationOptions[3];

        const options = sectionSettings.welcome_options;
        options.set('location', value[0]);

        if (isSpecific) options.set('channel', channels.current[0]);
        if (!options.get('msg')) options.set('msg', 'Welcome to the server {username}');
        setSectionSettings({ ...sectionSettings, welcome_options: options });
    }

    function onLeaveLocationChanged(value) {
        const isSpecific = value[0] === messageLeaveLocationOptions[1];

        const options = sectionSettings.leave_options;
        options.set('location', value[0]);

        if (isSpecific) options.set('channel', channels.current[0]);
        if (!options.get('msg')) options.set('msg', 'Sad to see you go {username}');
        setSectionSettings({ ...sectionSettings, leave_options: options });
    }

    function onWelcomeChannelChanged(value) {
        const options = sectionSettings.welcome_options;
        options.set('channel', value[0]);
        setSectionSettings({ ...sectionSettings, welcome_options: options });
    }

    function onLeaveChannelChanged(value) {
        const options = sectionSettings.leave_options;
        options.set('channel', value[0]);
        setSectionSettings({ ...sectionSettings, leave_options: options });
    }

    return (
        <div className="dashboard-content" style={style || {}}>

            <DashboardTextInput
                name={"Welcome Message"}
                value={sectionSettings.welcome_options.get('msg') || 'Welcome to the server {username}'}
                onValueChange={onWelcomeMsgChanged}
            />

            <DashboardDropdownInput
                name={"Welcome Message Location"}
                value={[sectionSettings.welcome_options.get('location') || messageLocationOptions[0]]}
                options={messageLocationOptions}
                minSelectedOptions={1}
                maxSelectedOptions={1}
                displayDataFunction={getLocationSettingName}
                displayDataFunctionPayload={messageLocationLookup}
                onValueChange={onWelcomeLocationChanged} />

            {sectionSettings.welcome_options.get('location') === messageLocationOptions[3] &&
                <DashboardDropdownInput
                    name={"Welcome Message Channel"}
                    value={[sectionSettings.welcome_options.get('channel') || channels.current[0]]}
                    options={channels.current}
                    minSelectedOptions={1}
                    maxSelectedOptions={1}
                    displayDataFunction={getChannelName}
                    displayDataFunctionPayload={channelLookup.current}
                    onValueChange={onWelcomeChannelChanged} />
            }

            <DashboardTextInput
                name={"Leave Message"}
                value={sectionSettings.leave_options.get('msg') || 'Sad to see you go {username}'}
                onValueChange={onLeaveMsgChanged}
            />

            <DashboardDropdownInput
                name={"Leave Message Location"}
                value={[sectionSettings.leave_options.get('location') || messageLocationOptions[0]]}
                options={messageLeaveLocationOptions}
                minSelectedOptions={1}
                maxSelectedOptions={1}
                displayDataFunction={getLocationSettingName}
                displayDataFunctionPayload={messageLocationLookup}
                onValueChange={onLeaveLocationChanged} />

            {sectionSettings.leave_options.get('location') === messageLocationOptions[3] &&
                <DashboardDropdownInput
                    name={"Leave Message Channel"}
                    value={[sectionSettings.leave_options.get('channel') || channels.current[0]]}
                    options={channels.current}
                    minSelectedOptions={1}
                    maxSelectedOptions={1}
                    displayDataFunction={getChannelName}
                    displayDataFunctionPayload={channelLookup.current}
                    onValueChange={onLeaveChannelChanged} />
            }


            {bHasBeenModified && <div className='dashboard-content-save'>
                <button onClick={onResetCategory} >Reset</button>
                <button onClick={onSaveCategory}>Save</button>
            </div>}
        </div>
    );
}

export default JoinLeaveCategory;