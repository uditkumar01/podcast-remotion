import { Composition } from 'remotion';
import { AudiogramComposition } from './Composition';
import './fonts.css';
import { PromoComposition } from './PromoComposition';
import './style.css';

const fps = 30;
const durationInFrames = 210 * fps;
const width = 2950;

export const RemotionVideo: React.FC = () => {
	return (
		<>
			<Composition
				id="Audiogram"
				component={AudiogramComposition}
				durationInFrames={durationInFrames}
				fps={fps}
				width={width}
				height={Math.round(width / 1.44)}
			/>
		</>
	);
};
