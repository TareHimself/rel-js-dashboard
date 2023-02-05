import React from 'react';
import '../../scss/main.scss';
import DashboardTextInput from './DashboardTextInput';
import DashboardDropdownInput from './DashboardDropdownInput';
import { DashboardSettingProps, IGenericLookup } from '../../types';
import { SettingsCategory } from './settingsCategoryBase';
import { EOptsKeyLocation, EPluginOptsKeys, locationIsChannel, ObjectValues, OptsParser } from '../../framework';

export default class LevelingCategory extends SettingsCategory<{ level_opts: string }>{
    levelingOptions: OptsParser<ObjectValues<typeof EPluginOptsKeys>>;

    constructor(props: DashboardSettingProps<{ level_opts: string }>) {
        super(props, { level_opts: props.settings.level_opts });

        this.levelingOptions = new OptsParser(this.state.level_opts);
    }

    updateLevelingMsg(msg: string) {
        this.levelingOptions.set(EPluginOptsKeys.MESSAGE, msg);

        this.updateState({ level_opts: this.levelingOptions.toString() });
    }

    updateLevelingLocation(option: string[]) {
        this.levelingOptions.set(EPluginOptsKeys.LOCATION, option[0]);

        this.updateState({ level_opts: this.levelingOptions.toString() });
    }

    updateTwitchChannel(option: string[]) {
        this.levelingOptions.set(EPluginOptsKeys.LOCATION, option[0]);

        this.updateState({ level_opts: this.levelingOptions.toString() });
    }

    updateTwitchRolesGiven(option: string[]) {
        this.levelingOptions.set(EPluginOptsKeys.GIVE_ROLE, option.join(','));

        this.updateState({ level_opts: this.levelingOptions.toString() });
    }

    updateTwitchRoleFilter(option: string[]) {
        this.levelingOptions.set(EPluginOptsKeys.FILTER_ROLE, option.join(','));

        this.updateState({ level_opts: this.levelingOptions.toString() });
    }

    hasModifiedSettings(): boolean {
        if (this.initialSettings.level_opts !== this.state.level_opts) return false;

        return true;
    }

    stateComparison(nextState: Readonly<typeof this.state>): boolean {
        if (nextState.level_opts !== this.state.level_opts) return true;

        return false;
    }

    get() {
        return (
            <>
                <DashboardDropdownInput<string, null>
                    name={"Leveling Message Location"}
                    value={[this.levelingOptions.get(EPluginOptsKeys.LOCATION) || EOptsKeyLocation.NONE]}
                    options={[EOptsKeyLocation.NONE, EOptsKeyLocation.CURRENT_CHANNEL, EOptsKeyLocation.DIRECT_MESSAGE, EOptsKeyLocation.SPECIFIC_CHANNEL]}
                    minSelection={1}
                    maxSelection={1}
                    displayFn={this.optLocationToString}
                    displayFnPayload={null}
                    onChange={this.updateLevelingLocation} />

                {(this.levelingOptions.get(EPluginOptsKeys.LOCATION) || EOptsKeyLocation.NONE) !== EOptsKeyLocation.NONE &&
                    <DashboardTextInput
                        name={"Leveling Message"}
                        value={this.levelingOptions.get(EPluginOptsKeys.MESSAGE) || '{username} just leveled up'}
                        onChange={this.updateLevelingMsg}
                    />
                }

                {locationIsChannel(this.levelingOptions.get(EPluginOptsKeys.LOCATION) as any) &&
                    <DashboardDropdownInput<string, IGenericLookup>
                        name={"Leveling Message Channel"}
                        value={[this.levelingOptions.get(EPluginOptsKeys.LOCATION) || this.props.meta.channels[0].id]}
                        options={this.channelIds}
                        minSelection={1}
                        maxSelection={1}
                        displayFn={this.getLookup}
                        displayFnPayload={this.channelLookup}
                        onChange={this.updateLevelingLocation} />
                }
            </>
        )
    }
}