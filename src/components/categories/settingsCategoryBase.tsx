/* eslint-disable @typescript-eslint/no-useless-constructor */
import React from "react";
import { DashboardSettingProps, IdentifierPair, IGenericLookup } from "../../types";
import { EOptsKeyLocation, IDatabaseGuildSettings } from "../../framework";


export abstract class SettingsCategory<T extends Partial<IDatabaseGuildSettings> = {}> extends React.PureComponent<DashboardSettingProps<T>, T> {

    initialSettings: T;
    channelLookup: IGenericLookup = {};
    channelIds: string[] = [];
    roleLookup: IGenericLookup = {};
    roleIds: string[] = [];
    constructor(props: DashboardSettingProps<T>, initialSettings: T, computeChannelLookup: boolean = true, computeRoleLookup: boolean = true) {
        super(props);
        this.initialSettings = initialSettings;
        this.state = initialSettings
        if (computeChannelLookup) {
            this.channelLookup = this.toLookup(props.meta.channels);
            this.channelIds = this.props.meta.channels.reduce((a, b) => {
                a.push(b.id)
                return a;
            }, [] as string[])
        }

        if (computeRoleLookup) {
            this.roleLookup = this.toLookup(props.meta.channels);
            this.roleIds = this.props.meta.channels.reduce((a, b) => {
                a.push(b.id)
                return a;
            }, [] as string[])
        }

    }

    updateState(update: Partial<typeof this.state>) {
        this.setState({ ...this.state, ...update });
    }

    getLookup(id: string, lookup: IGenericLookup) {
        return lookup[id];
    }

    toLookup(channels: IdentifierPair[]): IGenericLookup {
        return channels.reduce((lookup, b) => {

            lookup[b.id] = b.name;

            return lookup;
        }, {} as IGenericLookup);
    }

    hasModifiedSettings() {
        return false;
    }

    stateComparison(nextState: Readonly<typeof this.state>) {
        return false;
    }

    optLocationToString(opt: string, _: null): string {
        switch (opt) {
            case EOptsKeyLocation.NONE: {
                return "Disabled";
            }
            case EOptsKeyLocation.CURRENT_CHANNEL: {
                return "Current Channel";
            }
            case EOptsKeyLocation.DIRECT_MESSAGE: {
                return "Direct Message"
            }
            case EOptsKeyLocation.SPECIFIC_CHANNEL: {
                return "Specific Channel"
            }
        }

        return "Specific Channel";
    }

    onReset() {
        this.updateState(this.initialSettings);
    }

    onSave() {
        this.props.onChange(this.state);
    }

    get(): JSX.Element | null {
        return null;
    }

    render(): JSX.Element {
        return (
            <div className="dashboard-content" style={this.props.style}>
                {this.get()}
                <div className='dashboard-content-save' >
                    <button onClick={this.onReset}> Reset </button>
                    <button onClick={this.onSave} > Save </button>
                </div>
            </div>
        );
    }

    shouldComponentUpdate(nextProps: Readonly<DashboardSettingProps<T>>, nextState: Readonly<T>, nextContext: any): boolean {
        return this.hasModifiedSettings() || this.props.guildId !== nextProps.guildId || this.stateComparison(nextState);
    }
}