import { IDatabaseGuildSettings, IDatabaseUserSettings } from './common';

export interface IVector2 {
	x: number;
	y: number;
}

export interface IUserServerData {
	id: string;
	avatar: string;
	username: string;
	card_opts: IDatabaseUserSettings['card'];
}

export interface IGuildPartial {
	id: string;
	name: string;
	icon: string;
	owner: boolean;
	permissions: number;
	features: string[];
}

export interface IDashboardInputProps<I, C> {
	name: string;
	value: I;
	onChange: C;
}

export type Awaitable<T> = T | Promise<T>;

export type IdentifierPair = { id: string; name: string };

export interface IGuildPartial {
	id: string;
	icon: string;
	name: string;
	hasBot: boolean;
}

export interface IGenericLookup {
	[id: string]: string;
}

export interface IGuildFetchResponse {
	settings: IDatabaseGuildSettings;
	channels: IdentifierPair[];
	roles: IdentifierPair[];
}

export interface IGuildMeta {
	channels: IdentifierPair[];
	roles: IdentifierPair[];
}

export type DatabaseGuildKeys = keyof IDatabaseGuildSettings;
export type DashboardSettingProps<T extends DatabaseGuildKeys = 'id'> = {
	guildId: string;
	style?: React.CSSProperties;
	meta: IGuildMeta;
	settings: PartialWithSome<IDatabaseGuildSettings, T>;
	onChange: (
		value: PartialWithSome<IDatabaseGuildSettings, T>
	) => Awaitable<void>;
};

export interface ILoginDataRaw {
	session: string;
	user: string;
	nickname: string;
	avatar: string;
	card_opts: string;
}

export interface ILoginData {
	session: string;
	user: string;
	nickname: string;
	avatar: string;
	card_opts: IDatabaseUserSettings['card'];
}

export interface ICardData {
	bg: string;
	opacity: number;
	color: string;
}

export type PartialWithSome<T, S extends keyof T> = Partial<T> &
	Omit<T, Exclude<keyof T, S>>;
