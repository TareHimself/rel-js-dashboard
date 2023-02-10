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

        this.levelingOptions = new OptsParser(this.settings.level_opts);
    }

    onReset(initial: { level_opts: string; }): void {
        this.levelingOptions = new OptsParser(initial.level_opts)
    }

    onSave(): void {
        this.updateSettings({ level_opts: this.levelingOptions.encode() })
    }

    updateLevelingMsg(msg: string) {
        this.levelingOptions.set(EPluginOptsKeys.MESSAGE, msg);

        this.check()
    }

    updateLevelingLocation(option: string[]) {
        let final = option[0]
        if (final === EOptsKeyLocation.SPECIFIC_CHANNEL) {
            final = this.channelIds[0]
        }

        this.levelingOptions.set(EPluginOptsKeys.LOCATION, final);

        this.check()
        this.update()
    }

    hasModifiedSettings(): boolean {
        if (this.settings.level_opts !== this.levelingOptions.encode()) return true;

        return false;
    }

    get() {

        const bIsLevelingLocationChannel = locationIsChannel(this.levelingOptions.get(EPluginOptsKeys.LOCATION, EOptsKeyLocation.NONE) as any)

        return (
            <>
                <DashboardDropdownInput<string, null>
                    key={this.getKey('lml')}
                    name={"Leveling Message Location"}
                    value={[this.levelingOptions.get(EPluginOptsKeys.LOCATION, EOptsKeyLocation.NONE)]}
                    options={[EOptsKeyLocation.NONE, EOptsKeyLocation.CURRENT_CHANNEL, EOptsKeyLocation.DIRECT_MESSAGE, bIsLevelingLocationChannel ? this.levelingOptions.get(EPluginOptsKeys.LOCATION) : EOptsKeyLocation.SPECIFIC_CHANNEL]}
                    minSelection={1}
                    maxSelection={1}
                    displayFn={this.optLocationToString}
                    displayFnPayload={null}
                    onChange={this.updateLevelingLocation.bind(this)} />

                {this.levelingOptions.get(EPluginOptsKeys.LOCATION, EOptsKeyLocation.NONE) !== EOptsKeyLocation.NONE &&
                    <DashboardTextInput
                        key={this.getKey('lm')}
                        name={"Leveling Message"}
                        value={this.levelingOptions.get(EPluginOptsKeys.MESSAGE) || '{username} just leveled up'}
                        onChange={this.updateLevelingMsg.bind(this)}
                    />
                }

                {bIsLevelingLocationChannel &&
                    <DashboardDropdownInput<string, IGenericLookup>
                        key={this.getKey('lmc')}
                        name={"Leveling Message Channel"}
                        value={[this.levelingOptions.get(EPluginOptsKeys.LOCATION)]}
                        options={this.channelIds}
                        minSelection={1}
                        maxSelection={1}
                        displayFn={this.getLookup}
                        displayFnPayload={this.channelLookup}
                        onChange={this.updateLevelingLocation.bind(this)} />
                }
            </>
        )
    }
}