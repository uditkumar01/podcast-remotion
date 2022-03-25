import { Composition } from 'remotion';
import { AudiogramComposition } from './Composition';
import './fonts.css';
import { PromoComposition } from './PromoComposition';
import './style.css';

export const fps = 30;
const durationInFrames = 210 * fps + 300;
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
