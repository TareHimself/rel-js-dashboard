import '../../scss/main.scss';
import { useEffect } from 'react';

const iconStyle = {
	paddingTop: '200px',
	maxWidth: '300px',
	maxHeight: '300px',
};

function Invite() {
	useEffect(() => {
		const changePage = () => {
			(window.location as unknown as string) =
				'https://discord.com/api/oauth2/authorize?client_id=804165876362117141&permissions=8&scope=bot%20applications.commands';
		};

		const timeout = setTimeout(changePage, 2000);
		const clearChange = () => {
			clearTimeout(timeout);
		};

		return clearChange;
	});

	return (
		<section className="standard-page" id="invite">
			<img
				src={require('../../images/UmekoIcon500px.png')}
				style={iconStyle}
				alt="Logo"
			/>
			<h1>Thanks for the Invite</h1>
		</section>
	);
}

export default Invite;
