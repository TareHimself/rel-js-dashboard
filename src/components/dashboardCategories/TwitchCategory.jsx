import '../../scss/main.scss';
import { useState, useRef } from 'react';
import DashboardTextInput from './DashboardTextInput';
import DashboardDropdownInput from './DashboardDropdownInput';
import { isEqual } from '../../utils';

const messageLocationOptions = ['disabled','channel'];

function getChannelName(id, lookup) {
    return lookup[id];
}

function getLocationSettingName(location, options) {
    switch (options.indexOf(location)) {
        case 0:
            return 'Disabled';

        case 1:
            return 'Specific Channel';
        default:
            return 'Mistakes were made'
    }
}

function convertChannelsToObject(channels) {
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

    const channelLookup = useRef(convertChannelsToObject(guildData.channels))

    const bHasBeenModified = !isEqual(settingsToModify,sectionSettings);
    
    function onResetCategory(event) {
        setSectionSettings({...settingsToModify});
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
                displayDataFunctionPayload={messageLocationOptions}
                onValueChange={onTwitchLocationChanged} />

            {sectionSettings.twitch_options.get('location') === messageLocationOptions[1] &&
                <DashboardDropdownInput
                    name={"Twitch Message Channel"}
                    value={[sectionSettings.twitch_options.get('channel') || channels.current[0]]}
                    options={channels.current}
                    minSelectedOptions={1}
                    maxSelectedOptions={1}
                    displayDataFunction={getChannelName}
                    displayDataFunctionPayload={channelLookup.current}
                    onValueChange={onTwitchChannelChanged} />
            }


            {bHasBeenModified && <div className='dashboard-content-save'>
                <button onClick={onResetCategory} >Reset</button>
                <button onClick={onSaveCategory}>Save</button>
            </div>}
        </div>
    );
}

export default TwitchCategory