import '../scss/main.scss';
import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import { BiChevronDown } from 'react-icons/bi';
import { v4 as uuidv4 } from 'uuid';
import { DashboardConstants, hashString } from '../utils';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setCustomizingCard, setUserData } from '../redux/slices/mainSlice';
import { IUmekoApiResponse } from '../common';
import useSessionId from '../hooks/useSessionId';
import { ILoginData } from '../types';

const iconStyle = {
	margin: '0 10px',
	fontSize: '40px',
	verticalAlign: 'middle',
};

function User() {
	const { sessionId, updateSessionID } = useSessionId();

	const [theme, userData] = useAppSelector((s) => [s.main.theme, s.main.user]);

	const dispatch = useAppDispatch();

	const [showMenu, setShowMenu] = useState(false);

	const onLogin = useCallback(() => {
		const stateId = uuidv4();

		localStorage.setItem('stateId', stateId);

		let stateHash = hashString(stateId);

		const params = new URLSearchParams({
			client_id: DashboardConstants.CLIENT_ID,
			redirect_uri: `${window.location.origin}/auth`,
			response_type: 'code',
			scope: 'guilds identify',
			state: `${stateHash}`,
		});

		const targetUrl = `https://discord.com/api/oauth2/authorize?${params.toString()}`;

		window.location.href = targetUrl;
	}, []);

	const onLogout = useCallback(() => {
		axios
			.get<IUmekoApiResponse<string>>(
				`${DashboardConstants.SERVER_URL}/${sessionId}/logout`
			)
			.then(
				(response) => {
					updateSessionID(null);
				},
				(error) => {
					console.error(error);
					updateSessionID(null);
				}
			);
	}, [sessionId, updateSessionID]);

	const onClickLevelCard = useCallback(() => {
		dispatch(setCustomizingCard(true));
	}, [dispatch]);

	useEffect(() => {
		const decideCloseMenu = (ev: MouseEvent) => {
			if (ev.target === document.getElementById('dropdown-icon')) return;

			const dropdown = document.getElementById('user-menu-dropdown');
			if (dropdown) {
				const bounds = dropdown.getBoundingClientRect();

				if (
					ev.pageX > bounds.left &&
					ev.pageX < bounds.right &&
					ev.pageY > bounds.top &&
					ev.pageY < bounds.bottom
				)
					return;
			}

			setShowMenu(false);
		};

		if (showMenu) {
			window.addEventListener('click', decideCloseMenu);
		} else {
			window.removeEventListener('click', decideCloseMenu);
		}

		return () => window.removeEventListener('click', decideCloseMenu);
	}, [showMenu, setShowMenu]);

	useEffect(() => {
		if (sessionId && !userData) {
			axios
				.get<IUmekoApiResponse<ILoginData>>(
					`${DashboardConstants.SERVER_URL}/${sessionId}`
				)
				.then(
					(response) => {
						if (response.data.error) {
							updateSessionID(null);
							console.error(response.data.data);
						} else {
							dispatch(
								setUserData({
									id: response.data.data.user,
									username: response.data.data.nickname,
									avatar: response.data.data.avatar,
									card_opts: response.data.data.card_opts,
								})
							);
						}
					},
					(error) => {
						console.error(error);
						updateSessionID(null);
					}
				);
		}
	}, [sessionId, dispatch, updateSessionID, userData]);

	if (sessionId && userData) {
		return (
			<div className="user-dropdown">
				<img className="user-avatar" src={userData.avatar} alt="avatar" />
				<BiChevronDown
					id="dropdown-icon"
					className={`clickable-icons-${theme}`}
					style={iconStyle}
					onClick={() => setShowMenu(!showMenu)}
				/>
				{showMenu && (
					<div id="user-menu-dropdown" className="user-dropdown-content">
						<button className="dropdown-button" onClick={onClickLevelCard}>
							Level Card
						</button>
						<Link className="dropdown-button" to="/">
							Home
						</Link>
						<Link className="dropdown-button" to="/servers">
							Servers
						</Link>
						<Link className="dropdown-button" to="/privacy">
							Privacy Policy
						</Link>
						<Link className="dropdown-button" to="/terms">
							ToS
						</Link>
						<a
							className="dropdown-button"
							target="_blank"
							rel="noreferrer noopener"
							href="https://discord.gg/qx7eUVwTGY"
						>
							Support
						</a>
						<button className="dropdown-button" onClick={onLogout}>
							Log Out
						</button>
					</div>
				)}
			</div>
		);
	} else {
		return (
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
				}}
			>
				<button className="button" onClick={onLogin}>
					{' '}
					Login{' '}
				</button>
				<div className="user-dropdown">
					<BiChevronDown
						id="dropdown-icon"
						className={`clickable-icons-${theme}`}
						style={iconStyle}
						onClick={() => setShowMenu(!showMenu)}
					/>
					{showMenu && (
						<div id="user-menu-dropdown" className="user-dropdown-content">
							<Link className="dropdown-button" to="/">
								Home
							</Link>
							<Link className="dropdown-button" to="/privacy">
								Privacy Policy
							</Link>
							<Link className="dropdown-button" to="/terms">
								ToS
							</Link>
							<a
								className="dropdown-button"
								target="_blank"
								rel="noreferrer noopener"
								href="https://discord.gg/qx7eUVwTGY"
							>
								Support
							</a>
						</div>
					)}
				</div>
			</div>
		);
	}
}

export default User;
