import React from 'react';
import '../../scss/main.scss';
import DashboardTextInput from './DashboardTextInput';
import DashboardDropdownInput from './DashboardDropdownInput';
import { DashboardSettingProps, IGenericLookup } from '../../types';
import { SettingsCategory } from './settingsCategoryBase';
import { EOptsKeyLocation, EPluginOptsKeys, locationIsChannel, ObjectValues, OptsParser } from '../../framework';

export default class TwitchCategory extends SettingsCategory<{ twitch_opts: string }>{
    twitchOptions: OptsParser<ObjectValues<typeof EPluginOptsKeys>>;

    constructor(props: DashboardSettingProps<{ twitch_opts: string }>) {
        super(props, { twitch_opts: props.settings.twitch_opts });

        this.twitchOptions = new OptsParser(this.state.twitch_opts);
    }

    updateTwitchMsg(msg: string) {
        this.twitchOptions.set(EPluginOptsKeys.MESSAGE, msg);

        this.updateState({ twitch_opts: this.twitchOptions.toString() });
    }

    updateTwitchLocation(option: string[]) {
        this.twitchOptions.set(EPluginOptsKeys.LOCATION, option[0]);

        this.updateState({ twitch_opts: this.twitchOptions.toString() });
    }

    updateTwitchChannel(option: string[]) {
        this.twitchOptions.set(EPluginOptsKeys.LOCATION, option[0]);

        this.updateState({ twitch_opts: this.twitchOptions.toString() });
    }

    updateTwitchRolesGiven(option: string[]) {
        this.twitchOptions.set(EPluginOptsKeys.GIVE_ROLE, option.join(','));

        this.updateState({ twitch_opts: this.twitchOptions.toString() });
    }

    updateTwitchRoleFilter(option: string[]) {
        this.twitchOptions.set(EPluginOptsKeys.FILTER_ROLE, option.join(','));

        this.updateState({ twitch_opts: this.twitchOptions.toString() });
    }

    hasModifiedSettings(): boolean {
        if (this.initialSettings.twitch_opts !== this.state.twitch_opts) return false;

        return true;
    }

    stateComparison(nextState: Readonly<typeof this.state>): boolean {
        if (nextState.twitch_opts !== this.state.twitch_opts) return true;

        return false;
    }

    get() {
        return (
            <>
                <DashboardDropdownInput<string, null>
                    name={"Twitch Message Location"}
                    value={[this.twitchOptions.get(EPluginOptsKeys.LOCATION) || EOptsKeyLocation.NONE]}
                    options={[EOptsKeyLocation.NONE, EOptsKeyLocation.CURRENT_CHANNEL, EOptsKeyLocation.DIRECT_MESSAGE, EOptsKeyLocation.SPECIFIC_CHANNEL]}
                    minSelection={1}
                    maxSelection={1}
                    displayFn={this.optLocationToString}
                    displayFnPayload={null}
                    onChange={this.updateTwitchLocation} />

                {(this.twitchOptions.get(EPluginOptsKeys.LOCATION) || EOptsKeyLocation.NONE) !== EOptsKeyLocation.NONE &&
                    <DashboardTextInput
                        name={"Twitch Message"}
                        value={this.twitchOptions.get(EPluginOptsKeys.MESSAGE) || 'Welcome to the server {username}'}
                        onChange={this.updateTwitchMsg}
                    />
                }

                {locationIsChannel(this.twitchOptions.get(EPluginOptsKeys.LOCATION) as any) &&
                    <DashboardDropdownInput<string, IGenericLookup>
                        name={"Twitch Message Channel"}
                        value={[this.twitchOptions.get(EPluginOptsKeys.LOCATION) || this.props.meta.channels[0].id]}
                        options={this.channelIds}
                        minSelection={1}
                        maxSelection={1}
                        displayFn={this.getLookup}
                        displayFnPayload={this.channelLookup}
                        onChange={this.updateTwitchLocation} />
                }

                {locationIsChannel(this.twitchOptions.get(EPluginOptsKeys.LOCATION) as any) &&
                    <DashboardDropdownInput
                        name={"Twitch Roles Filter"}
                        value={(this.twitchOptions.get(EPluginOptsKeys.FILTER_ROLE) || "").split(',')}
                        options={this.channelIds}
                        minSelection={0}
                        maxSelection={Infinity}
                        displayFn={this.getLookup}
                        displayFnPayload={this.roleLookup}
                        onChange={this.updateTwitchRoleFilter} />
                }

                {locationIsChannel(this.twitchOptions.get(EPluginOptsKeys.LOCATION) as any) &&
                    <DashboardDropdownInput
                        name={"Twitch Roles To Give"}
                        value={(this.twitchOptions.get(EPluginOptsKeys.GIVE_ROLE) || "").split(',')}
                        options={this.channelIds}
                        minSelection={0}
                        maxSelection={Infinity}
                        displayFn={this.getLookup}
                        displayFnPayload={this.roleLookup}
                        onChange={this.updateTwitchRolesGiven} />
                }
            </>
        )
    }
}