import '../../scss/main.scss';
import { useEffect, useState } from 'react';
import GuildItem from '../GuidItem';
import axios from 'axios';
import useQuery from '../../hooks/useQuery';
import { BiSearchAlt } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { IGuildPartial } from '../../types';
import { DashboardConstants } from '../../utils';
import { IUmekoApiResponse } from '../../common';
import useSessionId from '../../hooks/useSessionId';

function Servers() {
	const query = useQuery();

	const navigate = useNavigate();
	const { sessionId } = useSessionId();
	const [guilds, setGuilds] = useState<IGuildPartial[]>([]);
	const [filter, setFilter] = useState(query.get('s') || '');

	let guildElements: JSX.Element[] = [];

	if (guilds.length) {
		const guildsToShow = guilds.filter(function (guild) {
			const lowerName = guild.name.toLowerCase();
			const lowerFilter = filter.toLowerCase();

			if (lowerFilter.length === 0) return true;

			return lowerName.includes(lowerFilter);
		});

		guildElements = guildsToShow.map((guildData) => (
			<GuildItem guild={guildData} key={guildData.id} />
		));
	}

	const handleSearchChange = function (changeEvent: any) {
		const currentUrlParams = query;

		currentUrlParams.set('s', changeEvent.target.value);

		navigate(window.location.pathname + '?' + currentUrlParams.toString(), {
			replace: true,
		});
	};

	useEffect(() => {
		const searchBox = document.getElementById('search-input');

		if (searchBox) {
			searchBox.addEventListener('change', handleSearchChange);

			const removeListner = () => {
				const inputBox = document.getElementById('search-input');

				if (inputBox)
					inputBox.removeEventListener('change', handleSearchChange);
			};
			return removeListner;
		}
	});

	useEffect(() => {
		if (!sessionId) {
			return undefined;
		}

		if (query.get('s') !== undefined) {
			const searchBox = document.getElementById(
				'search-input'
			) as HTMLInputElement;

			if (!searchBox) return undefined;

			if (query.get('s') && query.get('s') !== '' && searchBox.value === '') {
				searchBox.value = query.get('s')!;
			}
		}
	});

	useEffect(() => {
		if (!sessionId) {
			return undefined;
		}

		const headers = { sessionId: sessionId };

		axios
			.get<IUmekoApiResponse<IGuildPartial[]>>(
				`${DashboardConstants.SERVER_URL}/${sessionId}/guilds`,
				{ headers: headers }
			)
			.then(
				(response) => {
					if (response.data.error) {
						console.error(response.data.data);
						return;
					}
					setGuilds(response.data.data);
				},
				(error) => {
					console.error(error);
				}
			);
	}, [sessionId]);

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

	return (
		<section
			className="standard-page"
			id="Servers"
			style={{ paddingTop: '100px' }}
		>
			<div className="search-container">
				<input
					id="search-input"
					type="text"
					placeholder="Search.."
					value={filter}
					onChange={(event) => setFilter(event.target.value)}
				/>
				<BiSearchAlt />
			</div>

			<div className="guild-items">{guildElements}</div>
		</section>
	);
}

export default Servers;
