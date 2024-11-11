import '../../scss/main.scss';
import { Link } from 'react-router-dom';

function Home() {
	return (
		<section className="standard-page" id="Home">
			<div className="home-content-row">
				<img src={require('../../images/UmekoIcon500px.png')} alt="Logo" />
				<div className="home-content-row-info">
					<h1>Welcome</h1>
					<h3>
						Umeko is a multipurpose discord bot with commands for Anime, and
						Gaming, with more being added.
					</h3>
					<div>
						<Link
							className="home-content-row-button"
							data-pos="left"
							to="/invite"
						>
							Add To Server
						</Link>{' '}
						<a
							className="home-content-row-button"
							data-pos="right"
							target="_blank"
							rel="noreferrer noopener"
							href="https://discord.gg/qx7eUVwTGY"
						>
							Support
						</a>
					</div>
				</div>
			</div>
		</section>
	);
}

export default Home;
