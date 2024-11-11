import React from 'react';
import '../../scss/main.scss';
import DashboardTextInput from './DashboardTextInput';
import DashboardDropdownInput from './DashboardDropdownInput';
import { DashboardSettingProps, IGenericLookup } from '../../types';
import { SettingsCategory } from './settingsCategoryBase';
import {
	EOptsKeyLocation,
	EPluginOptsKeys,
	locationIsChannel,
	ObjectValues,
	OptsParser,
} from '../../common';

export default class JoinLeaveCategory extends SettingsCategory<
	'join_opts' | 'leave_opts'
> {
	joinOptions: OptsParser<ObjectValues<typeof EPluginOptsKeys>>;
	leaveOptions: OptsParser<ObjectValues<typeof EPluginOptsKeys>>;

	constructor(props: DashboardSettingProps<'join_opts' | 'leave_opts'>) {
		super(props, {
			join_opts: props.settings.join_opts,
			leave_opts: props.settings.leave_opts,
		});

		this.joinOptions = new OptsParser(this.settings.join_opts);

		this.leaveOptions = new OptsParser(this.settings.leave_opts);
	}

	override onReset(initial: typeof this.settings) {
		this.joinOptions = new OptsParser(initial.join_opts);
		this.leaveOptions = new OptsParser(initial.leave_opts);
	}

	override onSave(): void {
		this.updateSettings({
			join_opts: this.joinOptions.encode(),
			leave_opts: this.leaveOptions.encode(),
		});
	}

	updateJoinMsg(msg: string) {
		this.joinOptions.set(EPluginOptsKeys.MESSAGE, msg);
		this.check();
	}

	updateJoinLocation(option: string[]) {
		if (option[0] === EOptsKeyLocation.SPECIFIC_CHANNEL) {
			option[0] = this.channelIds[0];
		}

		this.joinOptions.set(EPluginOptsKeys.LOCATION, option[0]);

		this.check();
		this.update();
	}

	updateJoinChannel(option: string[]) {
		this.joinOptions.set(EPluginOptsKeys.LOCATION, option[0]);

		this.check();
	}

	updateLeaveMsg(msg: string) {
		this.leaveOptions.set(EPluginOptsKeys.MESSAGE, msg);

		this.check();
	}

	updateLeaveLocation(option: string[]) {
		if (option[0] === EOptsKeyLocation.SPECIFIC_CHANNEL) {
			option[0] = this.channelIds[0];
		}

		this.leaveOptions.set(EPluginOptsKeys.LOCATION, option[0]);

		this.check();
		this.update();
	}

	updateLeaveChannel(option: string[]) {
		this.leaveOptions.set(EPluginOptsKeys.LOCATION, option[0]);

		this.check();
	}

	override hasModifiedSettings(): boolean {
		if (this.settings.join_opts.join('') !== this.joinOptions.encode().join(''))
			return true;

		if (
			this.settings.leave_opts.join('') !== this.leaveOptions.encode().join('')
		)
			return true;

		return false;
	}

	override get() {
		const bIsJoinLocationChannel = locationIsChannel(
			this.joinOptions.get(
				EPluginOptsKeys.LOCATION,
				EOptsKeyLocation.NONE
			) as any
		);
		const bIsLeaveLocationChannel = locationIsChannel(
			this.leaveOptions.get(
				EPluginOptsKeys.LOCATION,
				EOptsKeyLocation.NONE
			) as any
		);
		return (
			<>
				<DashboardDropdownInput<string, null>
					key={this.getKey('jml')}
					name={'Join Message Location'}
					value={[
						this.joinOptions.get(
							EPluginOptsKeys.LOCATION,
							EOptsKeyLocation.NONE
						),
					]}
					options={[
						EOptsKeyLocation.NONE,
						EOptsKeyLocation.CURRENT_CHANNEL,
						EOptsKeyLocation.DIRECT_MESSAGE,
						bIsJoinLocationChannel
							? this.joinOptions.get(EPluginOptsKeys.LOCATION)
							: EOptsKeyLocation.SPECIFIC_CHANNEL,
					]}
					minSelection={1}
					maxSelection={1}
					displayFn={this.optLocationToString}
					displayFnPayload={null}
					onChange={this.updateJoinLocation.bind(this)}
				/>

				{this.joinOptions.get(
					EPluginOptsKeys.LOCATION,
					EOptsKeyLocation.NONE
				) !== EOptsKeyLocation.NONE && (
					<DashboardTextInput
						key={this.getKey('jm')}
						name={'Join Message'}
						value={
							this.joinOptions.get(EPluginOptsKeys.MESSAGE) ||
							'Welcome to the server {username}'
						}
						onChange={this.updateJoinMsg.bind(this)}
					/>
				)}

				{bIsJoinLocationChannel && (
					<DashboardDropdownInput<string, IGenericLookup>
						key={this.getKey('jmc')}
						name={'Join Message Channel'}
						value={[this.joinOptions.get(EPluginOptsKeys.LOCATION)]}
						options={this.channelIds}
						minSelection={1}
						maxSelection={1}
						displayFn={this.getLookup}
						displayFnPayload={this.channelLookup}
						onChange={this.updateJoinLocation.bind(this)}
					/>
				)}

				<DashboardDropdownInput<string, null>
					key={this.getKey('lml')}
					name={'Leave Message Location'}
					value={[
						this.leaveOptions.get(
							EPluginOptsKeys.LOCATION,
							EOptsKeyLocation.NONE
						),
					]}
					options={[
						EOptsKeyLocation.NONE,
						EOptsKeyLocation.CURRENT_CHANNEL,
						bIsLeaveLocationChannel
							? this.leaveOptions.get(EPluginOptsKeys.LOCATION)
							: EOptsKeyLocation.SPECIFIC_CHANNEL,
					]}
					minSelection={1}
					maxSelection={1}
					displayFn={this.optLocationToString}
					displayFnPayload={null}
					onChange={this.updateLeaveLocation.bind(this)}
				/>

				{this.leaveOptions.get(
					EPluginOptsKeys.LOCATION,
					EOptsKeyLocation.NONE
				) !== EOptsKeyLocation.NONE && (
					<DashboardTextInput
						key={this.getKey('lm')}
						name={'Leave Message'}
						value={
							this.leaveOptions.get(EPluginOptsKeys.MESSAGE) ||
							'Sad to see you go {username}'
						}
						onChange={this.updateLeaveMsg.bind(this)}
					/>
				)}

				{bIsLeaveLocationChannel && (
					<DashboardDropdownInput<string, IGenericLookup>
						key={this.getKey('lmc')}
						name={'Leave Message Channel'}
						value={[this.leaveOptions.get(EPluginOptsKeys.LOCATION)]}
						options={this.channelIds}
						minSelection={1}
						maxSelection={1}
						displayFn={this.getLookup}
						displayFnPayload={this.channelLookup}
						onChange={this.updateLeaveChannel.bind(this)}
					/>
				)}
			</>
		);
	}
}
