import React from 'react';
import '../../scss/main.scss';
import DashboardTextInput from './DashboardTextInput';
import DashboardDropdownInput from './DashboardDropdownInput';
import { DashboardSettingProps } from '../../types';
import { SettingsCategory } from './settingsCategoryBase';
import DashboardColorInput from './DashboardColorInput';
import {
	EBotOptsKeys,
	ObjectKeys,
	ObjectValues,
	OptsParser,
	FrameworkConstants,
} from '../../common';

const languageCodeLookup = {
	en: 'English',
	//es: 'Spanish',
	//fr: 'French'
} as const;

export type LanguageCodeKeys = ObjectKeys<typeof languageCodeLookup>;

function languageCodeToUI(
	code: LanguageCodeKeys,
	codes: typeof languageCodeLookup
) {
	return codes[code];
}

export default class GeneralCategory extends SettingsCategory<'bot_opts'> {
	botOptions: OptsParser<ObjectValues<typeof EBotOptsKeys>>;

	constructor(props: DashboardSettingProps<'bot_opts'>) {
		super(props, { bot_opts: props.settings.bot_opts }, false, false);

		this.botOptions = new OptsParser(this.settings.bot_opts);
	}

	override onReset(initial: typeof this.settings) {
		this.botOptions = new OptsParser(initial.bot_opts);
	}

	override onSave() {
		this.updateSettings({ bot_opts: this.botOptions.encode() });
	}

	updateNickname(update: string) {
		this.botOptions.set(EBotOptsKeys.BOT_NICKNAME, update);
		this.check();
	}

	updateColor(update: string) {
		this.botOptions.set(EBotOptsKeys.BOT_COLOR, update);
		this.check();
	}

	updateLanguage(update: string[]) {
		this.botOptions.set(EBotOptsKeys.BOT_LOCALE, update[0]);
		this.check();
	}

	hasModifiedSettings(): boolean {
		if (this.settings.bot_opts.join('') !== this.botOptions.encode().join(''))
			return true;

		return false;
	}

	get() {
		return (
			<>
				<DashboardTextInput
					key={this.getKey('nick')}
					name={'Nickname'}
					value={
						this.botOptions.get(EBotOptsKeys.BOT_NICKNAME) ||
						FrameworkConstants.DEFAULT_BOT_NAME
					}
					onChange={this.updateNickname.bind(this)}
				/>

				<DashboardColorInput
					key={this.getKey('col')}
					name={'Color'}
					value={
						this.botOptions.get(EBotOptsKeys.BOT_COLOR) ||
						FrameworkConstants.DEFAULT_BOT_COLOR
					}
					onChange={this.updateColor.bind(this)}
				/>

				<DashboardDropdownInput<LanguageCodeKeys, typeof languageCodeLookup>
					key={this.getKey('lan')}
					name={'Language'}
					value={
						[
							this.botOptions.get(EBotOptsKeys.BOT_LOCALE) ||
								FrameworkConstants.DEFAULT_BOT_LOCALE,
						] as LanguageCodeKeys[]
					}
					options={Object.keys(languageCodeLookup) as LanguageCodeKeys[]}
					minSelection={1}
					maxSelection={1}
					displayFn={languageCodeToUI}
					displayFnPayload={languageCodeLookup}
					onChange={this.updateLanguage.bind(this)}
				/>
			</>
		);
	}
}
