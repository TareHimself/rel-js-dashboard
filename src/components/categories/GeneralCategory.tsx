import React from 'react';
import '../../scss/main.scss';
import DashboardTextInput from './DashboardTextInput';
import DashboardDropdownInput from './DashboardDropdownInput';
import { DashboardSettingProps } from '../../types';
import { SettingsCategory } from './settingsCategoryBase';
import DashboardColorInput from './DashboardColorInput';
import { EBotOptsKeys, ObjectKeys, ObjectValues, OptsParser, FrameworkConstants } from '../../framework';

const languageCodeLookup = {
    en: 'English',
    es: 'Spanish',
    fr: 'French'
} as const;

export type LanguageCodeKeys = ObjectKeys<typeof languageCodeLookup>

function languageCodeToUI(code: LanguageCodeKeys, codes: typeof languageCodeLookup) {
    return codes[code];
}

export default class GeneralCategory extends SettingsCategory<{ bot_opts: string; }>{
    botOptions: OptsParser<ObjectValues<typeof EBotOptsKeys>>;

    constructor(props: DashboardSettingProps<{ bot_opts: string; }>) {
        super(props, { bot_opts: props.settings.bot_opts }, false, false);

        this.botOptions = new OptsParser(this.state.bot_opts);
    }

    updateNickname(update: string) {
        this.botOptions.set(EBotOptsKeys.BOT_NICKNAME, update);

        this.updateState({ bot_opts: this.botOptions.toString() });
    }

    updateColor(update: string) {
        this.botOptions.set(EBotOptsKeys.BOT_COLOR, update);

        this.updateState({ bot_opts: this.botOptions.toString() });
    }

    updateLanguage(update: string[]) {
        this.botOptions.set(EBotOptsKeys.BOT_LOCALE, update[0]);

        this.updateState({ bot_opts: this.botOptions.toString() });
    }

    hasModifiedSettings(): boolean {
        if (this.initialSettings.bot_opts !== this.state.bot_opts) return false;

        return true;
    }

    stateComparison(nextState: Readonly<typeof this.state>): boolean {
        if (nextState.bot_opts !== this.state.bot_opts) return true;

        return false;
    }

    get() {
        return (
            <>
                <DashboardTextInput
                    name={"Nickname"}
                    value={this.botOptions.get(EBotOptsKeys.BOT_NICKNAME) || FrameworkConstants.DEFAULT_BOT_NAME}
                    onChange={this.updateNickname}
                />

                <DashboardColorInput
                    name={"Color"}
                    value={this.botOptions.get(EBotOptsKeys.BOT_COLOR) || FrameworkConstants.DEFAULT_BOT_COLOR}
                    onChange={this.updateColor}
                />

                <DashboardDropdownInput<LanguageCodeKeys, typeof languageCodeLookup>
                    name={"Language"}
                    value={[(this.botOptions.get(EBotOptsKeys.BOT_LOCALE) || FrameworkConstants.DEFAULT_BOT_LOCALE)] as LanguageCodeKeys[]}
                    options={Object.keys(languageCodeLookup) as LanguageCodeKeys[]}
                    minSelection={1}
                    maxSelection={1}
                    displayFn={languageCodeToUI}
                    displayFnPayload={languageCodeLookup}
                    onChange={this.updateLanguage} />
            </>
        )
    }
}