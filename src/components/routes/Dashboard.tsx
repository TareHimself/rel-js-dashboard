import '../../scss/main.scss';
import useQuery from '../../hooks/useQuery';
import { useCallback, useEffect, useRef, useState } from 'react';
import { GoGraph } from 'react-icons/go';
import {
	IoSettingsOutline,
	IoChevronBack,
	IoLogoTwitch,
} from 'react-icons/io5';
import { SiMonkeytie } from 'react-icons/si';
import { AiOutlineBug } from 'react-icons/ai';
import { BsDoorOpen } from 'react-icons/bs';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IGuildFetchResponse, IGuildMeta } from '../../types';
import React from 'react';
import BugsCategory from '../categories/BugsCategory';
import GeneralCategory from '../categories/GeneralCategory';
import JoinLeaveCategory from '../categories/JoinLeaveCategory';
import LevelingCategory from '../categories/LevelingCategory';
import PermissionsCategory from '../categories/PermissionsCategory';
import TwitchCategory from '../categories/TwitchCategory';
import { IDatabaseGuildSettings, IUmekoApiResponse } from '../../common';
import { DashboardConstants } from '../../utils';
import useSessionId from '../../hooks/useSessionId';

function Dashboard() {
	const query = useQuery();

	const navigate = useNavigate();

	const { width } = useWindowDimensions();

	const { sessionId } = useSessionId();

	const metadata = useRef<IGuildMeta | null>(null);

	const [guildSettings, setGuildSettings] =
		useState<IDatabaseGuildSettings | null>(null);

	const closeDashboardSidebar = useCallback(() => {
		const dashboardSidebar = document.getElementById('dashboard-sidebar');
		if (
			dashboardSidebar &&
			dashboardSidebar.getAttribute('is-open') === 'true'
		) {
			dashboardSidebar.style.width = '';
			dashboardSidebar.style.minWidth = '';
			dashboardSidebar.setAttribute('is-open', 'false');
		}
	}, []);

	const onSelectCategory = useCallback(
		(category: string) => {
			const currentUrlParams = query;

			currentUrlParams.set('c', category);

			closeDashboardSidebar();

			navigate(window.location.pathname + '?' + currentUrlParams.toString(), {
				replace: true,
			});
		},
		[closeDashboardSidebar, navigate, query]
	);

	const updateGuildSettings = useCallback(
		(newSettings: Partial<IDatabaseGuildSettings>) => {
			if (guildSettings) {
				const finalSettings = { ...guildSettings, ...newSettings };
				setGuildSettings(finalSettings);

				const guildId = query.get('g');

				if (!guildId) return;

				axios
					.post<IUmekoApiResponse<string>>(
						`${DashboardConstants.SERVER_URL}/${sessionId}/guilds`,
						finalSettings
					)
					.then((response) => {
						if (response.data.error) {
							console.error(response.data.data);
						}
					})
					.catch(console.error);
			}
		},
		[guildSettings, query, sessionId]
	);

	useEffect(() => {
		const category = query.get('c') || 'general';

		const dashboardSidebar = document.getElementById('dashboard-sidebar');

		if (dashboardSidebar) {
			const elements = dashboardSidebar.children;
			for (let i = 0; i < elements.length; i++) {
				const currentElement = elements[i];

				if (currentElement.id === category + 'Category') {
					currentElement.setAttribute(
						'class',
						'dashboard-sidebar-button-selected'
					);
				} else if (
					currentElement.getAttribute('class') !== 'dashboard-sidebar-button'
				) {
					currentElement.setAttribute('class', 'dashboard-sidebar-button');
				}
			}
		}
	}, [query]);

	useEffect(() => {
		const guildId = query.get('g');

		if (guildSettings || !guildId || !sessionId) return undefined;

		const headers = { sessionId: sessionId };

		axios
			.get<IUmekoApiResponse<IGuildFetchResponse>>(
				`${DashboardConstants.SERVER_URL}/${sessionId}/guilds/${guildId}`,
				{ headers: headers }
			)
			.then(
				(response) => {
					const ApiResponse = response.data;

					if (!ApiResponse.error) {
						setGuildSettings(ApiResponse.data.settings);
						metadata.current = {
							channels: ApiResponse.data.channels,
							roles: ApiResponse.data.roles,
						};
					}
				},
				(error) => {
					console.error(error);
				}
			);
	}, [guildSettings, query, sessionId]);

	useEffect(() => {
		if (!sessionId) {
			navigate(
				{
					pathname: '/',
					search: '',
				},
				{
					replace: true,
				}
			);
		}
	}, [sessionId, navigate]);

	const getDashboardContentElement = useCallback(
		(category: string, settings: IDatabaseGuildSettings) => {
			if (!settings || !metadata.current) {
				return null;
			}

			const style = {
				paddingLeft: width <= 1200 ? '0px' : '250px',
			};

			switch (category) {
				case 'general':
					return (
						<GeneralCategory
							style={style}
							guildId={settings.id}
							settings={{ bot_opts: settings.bot_opts }}
							meta={metadata.current}
							onChange={updateGuildSettings}
						/>
					);

				case 'join-leave':
					return (
						<JoinLeaveCategory
							style={style}
							guildId={settings.id}
							settings={{
								join_opts: settings.join_opts,
								leave_opts: settings.leave_opts,
							}}
							meta={metadata.current}
							onChange={updateGuildSettings}
						/>
					);

				case 'leveling':
					return (
						<LevelingCategory
							style={style}
							guildId={settings.id}
							settings={{ level_opts: settings.level_opts }}
							meta={metadata.current}
							onChange={updateGuildSettings}
						/>
					);

				case 'twitch':
					return (
						<TwitchCategory
							style={style}
							guildId={settings.id}
							settings={{ twitch_opts: settings.twitch_opts }}
							meta={metadata.current}
							onChange={updateGuildSettings}
						/>
					);

				case 'permissions':
					return (
						<PermissionsCategory
							style={style}
							guildId={settings.id}
							settings={{ id: settings.id }}
							meta={metadata.current}
							onChange={updateGuildSettings}
						/>
					);

				case 'bugs':
					return (
						<BugsCategory
							style={style}
							guildId={settings.id}
							settings={{ id: settings.id }}
							meta={metadata.current}
							onChange={updateGuildSettings}
						/>
					);

				default:
					break;
			}

			return null;
		},
		[updateGuildSettings, width]
	);

	return (
		<section className="standard-page" id="Dashboard">
			<div className="dashboard-sidebar" id="dashboard-sidebar">
				{width <= 1200 && (
					<div
						className="dashboard-sidebar-button"
						onClick={() => closeDashboardSidebar()}
						style={{ margin: '15px 0' }}
					>
						<div className="dashboard-sidebar-button-items">
							<IoChevronBack className="dashboard-sidebar-icon" />
							<h1 style={{ fontSize: '25px' }}>Close</h1>
						</div>
					</div>
				)}

				<div
					className="dashboard-sidebar-button"
					onClick={() => onSelectCategory('general')}
					id="generalCategory"
				>
					<div className="dashboard-sidebar-button-items">
						<IoSettingsOutline className="dashboard-sidebar-icon" />
						<h3>General</h3>
					</div>
				</div>

				<div
					className="dashboard-sidebar-button"
					onClick={() => onSelectCategory('join-leave')}
					id="join-leaveCategory"
				>
					<div className="dashboard-sidebar-button-items">
						<BsDoorOpen className="dashboard-sidebar-icon" />
						<h3>Join/Leave</h3>
					</div>
				</div>

				<div
					className="dashboard-sidebar-button"
					onClick={() => onSelectCategory('leveling')}
					id="levelingCategory"
				>
					<div className="dashboard-sidebar-button-items">
						<GoGraph className="dashboard-sidebar-icon" />
						<h3>Leveling</h3>
					</div>
				</div>

				<div
					className="dashboard-sidebar-button"
					onClick={() => onSelectCategory('twitch')}
					id="twitchCategory"
				>
					<div className="dashboard-sidebar-button-items">
						<IoLogoTwitch className="dashboard-sidebar-icon" />
						<h3>Twitch</h3>
					</div>
				</div>

				{false && (
					<div
						className="dashboard-sidebar-button"
						onClick={() => onSelectCategory('permissions')}
						id="permissionsCategory"
					>
						<div className="dashboard-sidebar-button-items">
							<SiMonkeytie className="dashboard-sidebar-icon" />
							<h3>Permissions</h3>
						</div>
					</div>
				)}

				{false && (
					<div
						className="dashboard-sidebar-button"
						onClick={() => onSelectCategory('bugs')}
						id="bugsCategory"
					>
						<div className="dashboard-sidebar-button-items">
							<AiOutlineBug className="dashboard-sidebar-icon" />
							<h3>Bug Submissions</h3>
						</div>
					</div>
				)}
			</div>

			{guildSettings &&
				getDashboardContentElement(query.get('c') || 'general', guildSettings)}
		</section>
	);
}

export default Dashboard;
