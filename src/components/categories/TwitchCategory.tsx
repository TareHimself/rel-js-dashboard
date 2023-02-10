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

        this.twitchOptions = new OptsParser(this.settings.twitch_opts);
    }

    onReset(initial: { twitch_opts: string; }): void {
        this.twitchOptions = new OptsParser(initial.twitch_opts)
    }

    onSave(): void {
        this.updateSettings({ twitch_opts: this.twitchOptions.encode() })
    }

    updateTwitchMsg(msg: string) {
        this.twitchOptions.set(EPluginOptsKeys.MESSAGE, msg);
        this.check()
    }

    updateTwitchLocation(option: string[]) {
        if (option[0] === EOptsKeyLocation.SPECIFIC_CHANNEL) {
            option[0] = this.channelIds[0]
        }

        this.twitchOptions.set(EPluginOptsKeys.LOCATION, option[0]);
        this.check()
        this.update()
    }

    updateTwitchChannel(option: string[]) {
        this.twitchOptions.set(EPluginOptsKeys.LOCATION, option[0]);
        this.check()
    }

    updateTwitchRolesGiven(option: string[]) {
        this.twitchOptions.set(EPluginOptsKeys.GIVE_ROLE, option.join(','));
        this.check()
    }

    updateTwitchRoleFilter(option: string[]) {
        this.twitchOptions.set(EPluginOptsKeys.FILTER_ROLE, option.join(','));
        this.check()
    }

    hasModifiedSettings(): boolean {
        if (this.settings.twitch_opts !== this.twitchOptions.encode()) return true;

        return false;
    }


    get() {
        const bIsTwitchLocationChannel = locationIsChannel(this.twitchOptions.get(EPluginOptsKeys.LOCATION, EOptsKeyLocation.NONE) as any)
        return (
            <>
                <DashboardDropdownInput<string, null>
                    key={this.getKey('tml')}
                    name={"Twitch Message Location"}
                    value={[this.twitchOptions.get(EPluginOptsKeys.LOCATION) || EOptsKeyLocation.NONE]}
                    options={[EOptsKeyLocation.NONE, EOptsKeyLocation.CURRENT_CHANNEL, EOptsKeyLocation.DIRECT_MESSAGE, bIsTwitchLocationChannel ? this.twitchOptions.get(EPluginOptsKeys.LOCATION) : EOptsKeyLocation.SPECIFIC_CHANNEL]}
                    minSelection={1}
                    maxSelection={1}
                    displayFn={this.optLocationToString}
                    displayFnPayload={null}
                    onChange={this.updateTwitchLocation.bind(this)} />

                {this.twitchOptions.get(EPluginOptsKeys.LOCATION, EOptsKeyLocation.NONE) !== EOptsKeyLocation.NONE &&
                    <DashboardTextInput
                        key={this.getKey('tm')}
                        name={"Twitch Message"}
                        value={this.twitchOptions.get(EPluginOptsKeys.MESSAGE) || 'Welcome to the server {username}'}
                        onChange={this.updateTwitchMsg.bind(this)}
                    />
                }

                {bIsTwitchLocationChannel &&
                    <DashboardDropdownInput<string, IGenericLookup>
                        key={this.getKey('tmc')}
                        name={"Twitch Message Channel"}
                        value={[this.twitchOptions.get(EPluginOptsKeys.LOCATION)]}
                        options={this.channelIds}
                        minSelection={1}
                        maxSelection={1}
                        displayFn={this.getLookup}
                        displayFnPayload={this.channelLookup}
                        onChange={this.updateTwitchLocation.bind(this)} />
                }

                {bIsTwitchLocationChannel &&
                    <DashboardDropdownInput
                        key={this.getKey('trf')}
                        name={"Twitch Roles Filter"}
                        value={this.twitchOptions.get(EPluginOptsKeys.FILTER_ROLE).split(',')}
                        options={this.channelIds}
                        minSelection={0}
                        maxSelection={Infinity}
                        displayFn={this.getLookup}
                        displayFnPayload={this.roleLookup}
                        onChange={this.updateTwitchRoleFilter.bind(this)} />
                }

                {bIsTwitchLocationChannel &&
                    <DashboardDropdownInput
                        key={this.getKey('trg')}
                        name={"Twitch Roles To Give"}
                        value={this.twitchOptions.get(EPluginOptsKeys.GIVE_ROLE).split(',')}
                        options={this.channelIds}
                        minSelection={0}
                        maxSelection={Infinity}
                        displayFn={this.getLookup}
                        displayFnPayload={this.roleLookup}
                        onChange={this.updateTwitchRolesGiven.bind(this)} />
                }
            </>
        )
    }
}