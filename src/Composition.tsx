import { useAudioData, visualizeAudio } from '@remotion/media-utils';
import {
	Audio,
	Easing,
	Img,
	interpolate,
	Sequence,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import audioSource from './assets/video.mp4';
import subtitlesSource from './assets/subtitles.srt';
import { PaginatedSubtitles } from './Subtitles';

const AudioViz = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const audioData = useAudioData(audioSource);

	if (!audioData) {
		return null;
	}

	const allVisualizationValues = visualizeAudio({
		fps,
		frame,
		audioData,
		numberOfSamples: 256, // use more samples to get a nicer visualisation
	});

	// pick the low values because they look nicer than high values
	// feel free to play around :)
	const visualization = allVisualizationValues.slice(0, 36);

	return (
		<div className="relative h-16 w-[calc(100vw-1000px)]  overflow-hidden">
			<div className="left-0 bottom-0 absolute flex flex-row h-16 items-end justify-center gap-1 delay-400">
				{[...visualization, ...visualization.slice(1).reverse()].map((v) => {
					return (
						<div
							className="relative bg-red-300 rounded bg-color-animate"
							style={{
								height: `${300 * Math.sqrt(v)}%`,
								width: '2px',
							}}
						>
							<div
								className="absolute top-0 -left-2 bg-red-900 rounded-full rounded-full !delay-800 bg-color-animate"
								style={{ height: '6px', width: '6px' }}
							/>
							<div
								className="absolute top-0 left-2 bg-red-900 rounded-full rounded-full !delay-800 bg-color-animate"
								style={{ height: '6px', width: '6px' }}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export const AudiogramComposition = () => {
	const { durationInFrames } = useVideoConfig();

	// change this to adjust the part of the audio to use
	const offset = 0;

	return (
		<Sequence from={-offset}>
			<Audio src={audioSource} />

			<div
				className="flex flex-col w-full h-full text-white p-4 bg-black"
				style={{
					fontFamily: 'IBM Plex Sans',
				}}
			>
				<div className="flex flex-row">
					<Img
						className="rounded-lg"
						src="https://raw.githubusercontent.com/uditkumar01/Milanam/main/public/images/logo.png?token=GHSAT0AAAAAABQJAVLAWNPBIAVBCBAH36LGYSFWMEA"
					/>

					<div className="ml-4 leading-tight font-extrabold text-gray-700">
						<span className="text-blue-900">#milanam</span> - Create token gated
						party rooms to play games, stream videos, collaborate and more.
					</div>
				</div>

				<div className="flex-1 mt-4 text-2xl font-semibold max-w-[calc(100vh-500px)] overflow-hidden">
					<PaginatedSubtitles
						src={subtitlesSource}
						startFrame={offset}
						endFrame={offset + durationInFrames}
						linesPerPage={4}
						renderSubtitleItem={(item, frame) => (
							<>
								<span
									style={{
										backfaceVisibility: 'hidden',
										display: 'inline-block',

										opacity: interpolate(
											frame,
											[item.start, item.start + 15],
											[0, 1],
											{ extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
										),
										transform: `perspective(1000px) translateY(${interpolate(
											frame,
											[item.start, item.start + 15],
											[0.5, 0],
											{
												easing: Easing.out(Easing.quad),
												extrapolateLeft: 'clamp',
												extrapolateRight: 'clamp',
											}
										)}em)`,
									}}
								>
									{item.text}
								</span>{' '}
							</>
						)}
					/>
				</div>
				<div className="mt-0">
					<AudioViz />
				</div>
			</div>
		</Sequence>
	);
};
