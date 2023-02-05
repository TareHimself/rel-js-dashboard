import { IDatabaseGuildSettings } from "./framework";

export interface IVector2 {
    x: number;
    y: number;
}

export interface IUserServerData {
    id: string;
    avatar: string;
    username: string;
    card_opts: string;
}

export interface IGuildPartial {
    id: string;
    icon: string;
    name: string;
    hasBot: boolean;
}

export interface IDashboardInputProps<I, C> {
    name: string;
    value: I;
    onChange: C;
}

export type Awaitable<T> = T | Promise<T>;

export type IdentifierPair = { id: string, name: string }

export interface IGuildPartial {
    id: string;
    icon: string;
    name: string;
    hasBot: boolean;
}

export interface IGenericLookup {
    [id: string]: string
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

export type DashboardSettingProps<T extends Partial<IDatabaseGuildSettings> = {}> = { guildId: string; style?: React.CSSProperties, meta: IGuildMeta, settings: T; onChange: (value: T) => Awaitable<void> }

export interface ILoginDataRaw {
    session: string;
    user: string;
    nickname: string;
    avatar: string;
    card_opts: string
}

export interface ILoginData {
    session: string;
    user: string;
    nickname: string;
    avatar: string;
    card_opts: string;
}

export interface ICardData {
    bg: string;
    opacity: number;
    color: string;
}
