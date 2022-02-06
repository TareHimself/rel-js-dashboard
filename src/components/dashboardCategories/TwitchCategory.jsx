import '../../scss/main.scss';
import { useState, useRef } from 'react';
import DashboardTextInput from './DashboardTextInput';
import DashboardDropdownInput from './DashboardDropdownInput';
import { isEqual } from '../../utils';

const messageLocationOptions = ['disabled', 'channel'];

function mapIdToLookup(id, lookup) {
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

function convertToObject(channels) {
    const object = {};
    channels.forEach(channel => object[channel.id] = channel.name);
    return object;
}

function TwitchCategory({ style, guildData, settings, updateSettings }) {

    const settingsToModify = {
        twitch_message: settings.twitch_message,
        twitch_options: new URLSearchParams(settings.twitch_options)
    }

    const [sectionSettings, setSectionSettings] = useState(settingsToModify);

    const channels = useRef(guildData.channels.map(channel => channel.id));

    const channelLookup = useRef(convertToObject(guildData.channels));

    const roles = useRef(guildData.roles.map(roles => roles.id));

    const rolesLookup = useRef(convertToObject(guildData.roles));

    const bHasBeenModified = !isEqual(settingsToModify, sectionSettings);

    function onResetCategory(event) {
        setSectionSettings({ ...settingsToModify });
    }

    function onSaveCategory(event) {
        updateSettings({ ...settings, ...sectionSettings, twitch_options: sectionSettings.twitch_options.toString() });
    }

    function onTwitchMsgChanged(value) {
        setSectionSettings({ ...sectionSettings, twitch_message: value });
    }

    function onTwitchLocationChanged(value) {

        const isSpecific = value[0] === messageLocationOptions[1];

        const options = sectionSettings.twitch_options;

        options.set('location', value[0]);

        if (isSpecific) options.set('channel', channels.current[0]);

        setSectionSettings({ ...sectionSettings, twitch_options: options });
    }

    function onTwitchChannelChanged(value) {
        const options = sectionSettings.twitch_options;
        options.set('channel', value[0]);
        setSectionSettings({ ...sectionSettings, twitch_options: options });
    }

    function onTwitchFilterChanged(value) {
        const options = sectionSettings.twitch_options;
        options.set('filter', value.join());
        setSectionSettings({ ...sectionSettings, twitch_options: options });
    }

    function onTwitchRolesGivenChanged(value) {
        const options = sectionSettings.twitch_options;
        options.set('give', value.join());
        setSectionSettings({ ...sectionSettings, twitch_options: options });
    }

    return (
        <div className="dashboard-content" style={style || {}}>

            <DashboardTextInput
                name={"Twitch Message"}
                value={sectionSettings.twitch_message}
                onValueChange={onTwitchMsgChanged}
            />

            <DashboardDropdownInput
                name={"Twitch Message Location"}
                value={[sectionSettings.twitch_options.get('location') || messageLocationOptions[0]]}
                options={messageLocationOptions}
                minSelectedOptions={1}
                maxSelectedOptions={1}
                displayDataFunction={getLocationSettingName}
                displayDataFunctionPayload={messageLocationLookup}
                onValueChange={onTwitchLocationChanged} />

            {sectionSettings.twitch_options.get('location') === messageLocationOptions[1] &&
                <DashboardDropdownInput
                    name={"Twitch Message Channel"}
                    value={[sectionSettings.twitch_options.get('channel') || channels.current[0]]}
                    options={channels.current}
                    minSelectedOptions={1}
                    maxSelectedOptions={1}
                    displayDataFunction={mapIdToLookup}
                    displayDataFunctionPayload={channelLookup.current}
                    onValueChange={onTwitchChannelChanged} />
            }

            {sectionSettings.twitch_options.get('location') === messageLocationOptions[1] &&
                <DashboardDropdownInput
                    name={"Roles Filter"}
                    value={sectionSettings.twitch_options.get('filter') ? sectionSettings.twitch_options.get('filter').split(',') : []}
                    options={roles.current}
                    minSelectedOptions={0}
                    maxSelectedOptions={Infinity}
                    displayDataFunction={mapIdToLookup}
                    displayDataFunctionPayload={rolesLookup.current}
                    onValueChange={onTwitchFilterChanged} />
            }

            {sectionSettings.twitch_options.get('location') === messageLocationOptions[1] &&
                <DashboardDropdownInput
                    name={"Roles To Give"}
                    value={sectionSettings.twitch_options.get('give') ? sectionSettings.twitch_options.get('give').split(',') : []}
                    options={roles.current}
                    minSelectedOptions={0}
                    maxSelectedOptions={Infinity}
                    displayDataFunction={mapIdToLookup}
                    displayDataFunctionPayload={rolesLookup.current}
                    onValueChange={onTwitchRolesGivenChanged} />
            }



            {bHasBeenModified && <div className='dashboard-content-save'>
                <button onClick={onResetCategory} >Reset</button>
                <button onClick={onSaveCategory}>Save</button>
            </div>}
        </div>
    );
}

export default TwitchCategory