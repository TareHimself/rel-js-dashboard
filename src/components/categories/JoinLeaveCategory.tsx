import React from 'react';
import '../../scss/main.scss';
import DashboardTextInput from './DashboardTextInput';
import DashboardDropdownInput from './DashboardDropdownInput';
import { DashboardSettingProps, IGenericLookup } from '../../types';
import { SettingsCategory } from './settingsCategoryBase';
import { EOptsKeyLocation, EPluginOptsKeys, locationIsChannel, ObjectValues, OptsParser } from '../../framework';

export default class JoinLeaveCategory extends SettingsCategory<{ join_opts: string, leave_opts: string }>{
    joinOptions: OptsParser<ObjectValues<typeof EPluginOptsKeys>>;
    leaveOptions: OptsParser<ObjectValues<typeof EPluginOptsKeys>>;

    constructor(props: DashboardSettingProps<{ join_opts: string, leave_opts: string }>) {
        super(props, { join_opts: props.settings.join_opts, leave_opts: props.settings.leave_opts });

        this.joinOptions = new OptsParser(this.state.join_opts);

        this.leaveOptions = new OptsParser(this.state.leave_opts);
    }

    updateJoinMsg(msg: string) {
        this.joinOptions.set(EPluginOptsKeys.MESSAGE, msg);

        this.updateState({ join_opts: this.joinOptions.toString() });
    }

    updateJoinLocation(option: string[]) {
        this.joinOptions.set(EPluginOptsKeys.LOCATION, option[0]);

        this.updateState({ join_opts: this.joinOptions.toString() });
    }

    updateJoinChannel(option: string[]) {
        this.joinOptions.set(EPluginOptsKeys.LOCATION, option[0]);

        this.updateState({ join_opts: this.joinOptions.toString() });
    }


    updateLeaveMsg(msg: string) {
        this.leaveOptions.set(EPluginOptsKeys.MESSAGE, msg);

        this.updateState({ leave_opts: this.leaveOptions.toString() });
    }

    updateLeaveLocation(option: string[]) {
        this.leaveOptions.set(EPluginOptsKeys.LOCATION, option[0]);

        this.updateState({ leave_opts: this.leaveOptions.toString() });
    }

    updateLeaveChannel(option: string[]) {
        this.leaveOptions.set(EPluginOptsKeys.LOCATION, option[0]);

        this.updateState({ leave_opts: this.leaveOptions.toString() });
    }


    hasModifiedSettings(): boolean {
        if (this.initialSettings.join_opts !== this.state.join_opts) return false;

        if (this.initialSettings.leave_opts !== this.state.leave_opts) return false;

        return true;
    }

    stateComparison(nextState: Readonly<typeof this.state>): boolean {
        if (nextState.join_opts !== this.state.join_opts) return true;

        if (nextState.leave_opts !== this.state.leave_opts) return true;

        return false;
    }

    get() {
        return (
            <>


                <DashboardDropdownInput<string, null>
                    name={"Join Message Location"}
                    value={[this.joinOptions.get(EPluginOptsKeys.LOCATION) || EOptsKeyLocation.NONE]}
                    options={[EOptsKeyLocation.NONE, EOptsKeyLocation.CURRENT_CHANNEL, EOptsKeyLocation.DIRECT_MESSAGE, EOptsKeyLocation.SPECIFIC_CHANNEL]}
                    minSelection={1}
                    maxSelection={1}
                    displayFn={this.optLocationToString}
                    displayFnPayload={null}
                    onChange={this.updateJoinLocation} />

                {(this.joinOptions.get(EPluginOptsKeys.LOCATION) || EOptsKeyLocation.NONE) !== EOptsKeyLocation.NONE &&
                    <DashboardTextInput
                        name={"Join Message"}
                        value={this.joinOptions.get(EPluginOptsKeys.MESSAGE) || 'Welcome to the server {username}'}
                        onChange={this.updateJoinMsg}
                    />
                }

                {locationIsChannel(this.joinOptions.get(EPluginOptsKeys.LOCATION) as any) &&
                    <DashboardDropdownInput<string, IGenericLookup>
                        name={"Join Message Channel"}
                        value={[this.joinOptions.get(EPluginOptsKeys.LOCATION) || this.props.meta.channels[0].id]}
                        options={this.channelIds}
                        minSelection={1}
                        maxSelection={1}
                        displayFn={this.getLookup}
                        displayFnPayload={this.channelLookup}
                        onChange={this.updateJoinLocation} />
                }


                <DashboardDropdownInput<string, null>
                    name={"Leave Message Location"}
                    value={[this.leaveOptions.get(EPluginOptsKeys.LOCATION) || EOptsKeyLocation.NONE]}
                    options={[EOptsKeyLocation.NONE, EOptsKeyLocation.CURRENT_CHANNEL, EOptsKeyLocation.SPECIFIC_CHANNEL]}
                    minSelection={1}
                    maxSelection={1}
                    displayFn={this.optLocationToString}
                    displayFnPayload={null}
                    onChange={this.updateLeaveLocation} />

                {(this.joinOptions.get(EPluginOptsKeys.LOCATION) || EOptsKeyLocation.NONE) !== EOptsKeyLocation.NONE &&
                    <DashboardTextInput
                        name={"Leave Message"}
                        value={this.leaveOptions.get(EPluginOptsKeys.MESSAGE) || 'Sad to see you go {username}'}
                        onChange={this.updateLeaveMsg}
                    />
                }

                {locationIsChannel(this.leaveOptions.get(EPluginOptsKeys.LOCATION) as any) &&
                    <DashboardDropdownInput<string, IGenericLookup>
                        name={"Leave Message Channel"}
                        value={[this.leaveOptions.get(EPluginOptsKeys.LOCATION) || this.props.meta.channels[0].id]}
                        options={this.channelIds}
                        minSelection={1}
                        maxSelection={1}
                        displayFn={this.getLookup}
                        displayFnPayload={this.channelLookup}
                        onChange={this.updateLeaveChannel} />
                }
            </>
        )
    }
}