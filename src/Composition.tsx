import { AbsoluteFill, Series } from 'remotion';
import { useAudioData, visualizeAudio } from '@remotion/media-utils';
import {
	Audio,
	Easing,
	Img,
	interpolate,
	Sequence,
	useCurrentFrame,
	useVideoConfig,
	Video,
} from 'remotion';
import videoSource from './assets/video.webm';
import audioSource from './assets/audio.mp3';
import subtitlesSource from './assets/subtitles.srt';
import { PaginatedSubtitles } from './Subtitles';
import introSource from './assets/intro.webm';

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
	const frame = useCurrentFrame();
	const { durationInFrames } = useVideoConfig();

	// change this to adjust the part of the audio to use
	const offset = 200;

	const opacity = interpolate(
		frame,
		[0, offset / 8, offset / 4, offset / 2, offset],
		[0, 1, 1, 1, 0]
	);

	const lift = interpolate(
		frame,
		[0, offset / 8, offset / 4, offset / 2, offset],
		[-20, 0, 0, 0, 0]
	);

	const decreaseVolume = (f: number) =>
		interpolate(
			f,
			[0, offset / 8, offset / 4, offset / 2, offset],
			[1, 1, 1, 0.5, 0]
		);

	return (
		<>
			<Series key="audiogram-series-1">
				<Series.Sequence durationInFrames={offset}>
					<Audio
						src={audioSource}
						volume={(f) => {
							return Math.abs(decreaseVolume(f));
						}}
					/>
					<AbsoluteFill>
						<Video
							src={introSource}
							// className="scale=1.5"
							style={{
								height: '100%',
								transform: 'scale(1.5)',
							}}
						/>
					</AbsoluteFill>
					<div className="flex flex-col justify-center items-center relative h-full w-full">
						<div className="flex flex-1 flex-col justify-center items-center relative h-full w-full">
							<h1
								className="text-8xl font-extrabold text-center text-black"
								style={{
									lineHeight: '9.5rem',
									opacity,
									transform: `translateX(${lift}px)`,
								}}
							>
								TOKEN
							</h1>
							<h1
								className="text-8xl font-extrabold text-center text-white"
								style={{
									lineHeight: '9rem',
									opacity,
									transform: `scale(${1.5 * (1 + Math.abs(lift) / 30)})`,
								}}
							>
								GATED
							</h1>
							<h1
								className="text-8xl font-extrabold text-center text-black"
								style={{
									lineHeight: '9.5rem',
									opacity,
									transform: `translateX(${-lift}px)`,
								}}
							>
								PARTIES
							</h1>
						</div>
						<h3
							className="m-7 text-4xl font-extrabold text-center text-red-300"
							style={{
								opacity,
								transform: `translateY(${-lift}px)`,
							}}
						>
							Milanam
						</h3>
					</div>
				</Series.Sequence>
				<Series.Sequence durationInFrames={durationInFrames - offset}>
					<Audio src={audioSource} volume={0.03} />

					<div
						className="flex flex-col w-full h-full bg-red-800 text-white p-4 bg-white bg-color-animate"
						style={{
							fontFamily: 'IBM Plex Sans',
						}}
					>
						<div className="flex justify-center w-full rounded-t overflow-hidden">
							<Video src={videoSource} style={{ width: '100%' }} />
						</div>

						<div
							className="flex-1 mt-0 font-medium rounded-b overflow-hidden"
							style={{
								fontSize: '48px',
							}}
						>
							<PaginatedSubtitles
								src={subtitlesSource}
								// startFrame={offset}
								// endFrame={offset + durationInFrames}
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
													{
														extrapolateLeft: 'clamp',
														extrapolateRight: 'clamp',
													}
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
						{/* <div className="mt-0">
					<AudioViz />
				</div> */}
					</div>
				</Series.Sequence>
			</Series>
		</>
	);
};
