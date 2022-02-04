import { useState } from 'react';
import '../../scss/main.scss';
import DashboardColorInput from './DashboardColorInput';
import DashboardTextInput from './DashboardTextInput';
import DashboardDropdownInput from './DashboardDropdownInput';
import { isEqual } from '../../utils';

const languageCodeLookup = {
    en : 'English',
    es : 'Spanish',
    fr : 'French'
};

const languageCodes = ['en']

function languageCodeToUI(code,codes)
{
    return codes[code];
}

function GeneralCategory({ style , settings, updateSettings }) {

    const settingsToModify = {
        prefix : settings.prefix,
        nickname : settings.nickname,
        color : settings.color,
        language : settings.language
    }

    const [sectionSettings,setSectionSettings] = useState(settingsToModify);

    const bHasBeenModified = !isEqual(settingsToModify,sectionSettings);

    function onResetCategory(event){
        setSectionSettings({...settingsToModify});
    }

    function onSaveCategory(event){
        updateSettings({...settings,...sectionSettings});
    }


    function onNicknameChanged(value){
        setSectionSettings({...sectionSettings, nickname : value});
    }

    function onColorChanged(value){
        setSectionSettings({...sectionSettings, color : value});
    }

    function onLanguageChanged(value){
        setSectionSettings({...sectionSettings, language : value.toString()});
    }

    function onPrefixChanged(value){
        setSectionSettings({...sectionSettings, prefix : value});
    }

    return (
        <div className="dashboard-content" style={style || {}}>

            <DashboardTextInput 
            name={"Nickname"} 
            value={sectionSettings.nickname} 
            onValueChange={onNicknameChanged}
            />
            
            <DashboardColorInput 
            name={"Color"} 
            value={sectionSettings.color} 
            onValueChange={onColorChanged}
            />
            
            <DashboardDropdownInput 
            name={"Language"} 
            value={[sectionSettings.language]} 
            options={languageCodes}
            minSelectedOptions={1}
            maxSelectedOptions={1} 
            displayDataFunction={languageCodeToUI}
            displayDataFunctionPayload={languageCodeLookup}
            onValueChange={onLanguageChanged}/>

            <DashboardTextInput 
            name={"Prefix"} 
            value={sectionSettings.prefix} 
            onValueChange={onPrefixChanged}
            />
            

            { bHasBeenModified && <div className='dashboard-content-save'>
                <button onClick={onResetCategory} >Reset</button>
                <button onClick={onSaveCategory}>Save</button>
            </div>}
        </div>
    );
}

export default GeneralCategory;