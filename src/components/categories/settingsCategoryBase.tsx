/* eslint-disable @typescript-eslint/no-useless-constructor */
import React from 'react';
import {
	DashboardSettingProps,
	DatabaseGuildKeys,
	IdentifierPair,
	IGenericLookup,
	PartialWithSome,
} from '../../types';
import { EOptsKeyLocation, IDatabaseGuildSettings } from '../../common';

export type SettingCategoryState<T extends DatabaseGuildKeys> = {
	settings: PartialWithSome<IDatabaseGuildSettings, T>;
};

const SAVE_BAR_ID = 'dashboard-save-bar';
export abstract class SettingsCategory<
	T extends DatabaseGuildKeys
> extends React.Component<
	DashboardSettingProps<T>,
	{ rebuilds: number; updates: number }
> {
	settings: DashboardSettingProps<T>['settings'];
	channelLookup: IGenericLookup = {};
	channelIds: string[] = [];
	roleLookup: IGenericLookup = {};
	roleIds: string[] = [];
	constructor(
		props: DashboardSettingProps<T>,
		settings: DashboardSettingProps<T>['settings'],
		computeChannelLookup: boolean = true,
		computeRoleLookup: boolean = true
	) {
		super(props);
		this.settings = settings;
		this.state = {
			rebuilds: 0,
			updates: 0,
		};
		if (computeChannelLookup) {
			this.channelLookup = this.toLookup(props.meta.channels);
			this.channelIds = this.props.meta.channels.reduce((a, b) => {
				a.push(b.id);
				return a;
			}, [] as string[]);
		}

		if (computeRoleLookup) {
			this.roleLookup = this.toLookup(props.meta.channels);
			this.roleIds = this.props.meta.channels.reduce((a, b) => {
				a.push(b.id);
				return a;
			}, [] as string[]);
		}
	}

	check() {
		const element = document.getElementById(SAVE_BAR_ID)!;
		if (this.hasModifiedSettings()) {
			element.setAttribute('data-modified', 'true');
		} else {
			element.setAttribute('data-modified', 'false');
		}
	}

	updateSettings(update: DashboardSettingProps<T>['settings']) {
		this.settings = { ...this.settings, ...update };
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

	optLocationToString(opt: string, _: null): string {
		switch (opt) {
			case EOptsKeyLocation.NONE: {
				return 'Disabled';
			}
			case EOptsKeyLocation.CURRENT_CHANNEL: {
				return 'Current Channel';
			}
			case EOptsKeyLocation.DIRECT_MESSAGE: {
				return 'Direct Message';
			}
			case EOptsKeyLocation.SPECIFIC_CHANNEL: {
				return 'Specific Channel';
			}
		}

		return 'Specific Channel';
	}

	getKey(id: string) {
		return `${id}${this.state.rebuilds}`;
	}

	rebuild() {
		this.setState({ rebuilds: this.state.rebuilds + 1 });
	}

	update() {
		this.setState({ updates: this.state.updates + 1 });
	}

	reset() {
		this.onReset(this.settings);
		this.updateSettings(this.settings);
		this.check();
	}

	save() {
		this.onSave();
		this.props.onChange(this.settings);
		this.check();
		this.rebuild();
	}

	onReset(initial: DashboardSettingProps<T>['settings']) {}

	onSave() {}

	get(): JSX.Element | null {
		return null;
	}

	render(): JSX.Element {
		return (
			<div className="dashboard-content" style={this.props.style}>
				{this.get()}
				<div
					id={SAVE_BAR_ID}
					className="dashboard-content-save"
					data-modified={'false'}
				>
					<button onClick={() => this.reset()}> Reset </button>
					<button onClick={() => this.save()}> Save </button>
				</div>
			</div>
		);
	}
}
