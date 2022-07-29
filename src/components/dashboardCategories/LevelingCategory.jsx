import '../../scss/main.scss';
import { useState, useRef } from 'react';
import DashboardTextInput from './DashboardTextInput';
import DashboardDropdownInput from './DashboardDropdownInput';
import { isEqual } from '../../utils';

const messageLocationOptions = ['disabled', 'current', 'dm', 'channel'];

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

function LevelingCategory({ style, guildData, settings, updateSettings }) {

    const settingsToModify = {
        leveling_options: new URLSearchParams(settings.leveling_options)
    }

    const [sectionSettings, setSectionSettings] = useState(settingsToModify);

    const channels = useRef(guildData.channels.map(channel => channel.id));

    const channelLookup = useRef(convertChannelsToObject(guildData.channels))

    const bHasBeenModified = !isEqual(settingsToModify, sectionSettings);

    function onResetCategory(event) {
        setSectionSettings({ ...settingsToModify });
    }

    function onSaveCategory(event) {
        updateSettings({ ...settings, ...sectionSettings, leveling_options: sectionSettings.leveling_options.toString() });
    }

    function onLevelingMsgChanged(value) {
        const options = sectionSettings.leveling_options;
        options.set('msg', value);
        setSectionSettings({ ...sectionSettings, leveling_options: options });
    }

    function onLevelingLocationChanged(value) {
        const isSpecific = value[0] === messageLocationOptions[3];

        const options = sectionSettings.leveling_options;
        options.set('location', value[0]);

        if (isSpecific) options.set('channel', channels.current[0]);
        if (!options.get('msg')) options.set('msg', '{username} just leveled up');
        setSectionSettings({ ...sectionSettings, leveling_options: options });
    }

    function onLevelingChannelChanged(value) {
        const options = sectionSettings.leveling_options;

        options.set('channel', value[0]);

        setSectionSettings({ ...sectionSettings, leveling_options: options });
    }

    return (
        <div className="dashboard-content" style={style || {}}>

            <DashboardTextInput
                name={"Level Up Message"}
                value={sectionSettings.leveling_options.get('msg') || '{username} just leveled up'}
                onValueChange={onLevelingMsgChanged}
            />

            <DashboardDropdownInput
                name={"Level Up Message Location"}
                value={[sectionSettings.leveling_options.get('location') || messageLocationOptions[0]]}
                options={messageLocationOptions}
                minSelectedOptions={1}
                maxSelectedOptions={1}
                displayDataFunction={getLocationSettingName}
                displayDataFunctionPayload={messageLocationLookup}
                onValueChange={onLevelingLocationChanged} />

            {sectionSettings.leveling_options.get('location') === messageLocationOptions[3] &&
                <DashboardDropdownInput
                    name={"Level Up Message Channel"}
                    value={[sectionSettings.leveling_options.get('channel') || channels.current[0]]}
                    options={channels.current}
                    minSelectedOptions={1}
                    maxSelectedOptions={1}
                    displayDataFunction={getChannelName}
                    displayDataFunctionPayload={channelLookup.current}
                    onValueChange={onLevelingChannelChanged} />
            }


            {bHasBeenModified && <div className='dashboard-content-save'>
                <button onClick={onResetCategory} >Reset</button>
                <button onClick={onSaveCategory}>Save</button>
            </div>}
        </div>
    );
}

export default LevelingCategory;