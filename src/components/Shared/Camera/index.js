/**
 * @concept COMPONENTE QUE UTILIZA LA CÁMARA DEL DISPOSITIVO
 * @o Utiliza los hooks :
 * useUserMedia
 * useCardRatio
 * useOffsets
 * @o También la librería react-measure
 * ----------------------------------------------------------------
 * @data Retorna:
 * @fields image: Una imagen blob para pintar la previsualización
 * @fields base64: Un String base64 para envío
 */

import React, { useState, useRef } from 'react';
import Measure from 'react-measure';
import useUserMedia from '../../../hooks/camera/use-user-media';
import useCardRatio from '../../../hooks/camera/use-card-ratio';
import useOffsets from '../../../hooks/camera/use-offsets';
import { Col, Row, Button } from 'antd';

const CAPTURE_OPTIONS = {
	audio: false,
	video: { facingMode: 'environment' },
};

const Camera = ({ onCapture }) => {
	const canvasRef = useRef(null);
	const videoRef = useRef(null);

	const [container, setContainer] = useState({ width: 0, height: 0 });
	const [isVideoPlaying, setIsVideoPlaying] = useState(false);
	const [isFlashing, setIsFlashing] = useState(false);

	const mediaStream = useUserMedia(CAPTURE_OPTIONS);
	const [aspectRatio, calculateRatio] = useCardRatio(1.586);
	const offsets = useOffsets(
		videoRef.current && videoRef.current.videoWidth,
		videoRef.current && videoRef.current.videoHeight,
		container.width,
		container.height
	);

	if (mediaStream && videoRef.current && !videoRef.current.srcObject) {
		videoRef.current.srcObject = mediaStream;
	}

	const handleResize = (contentRect) => {
		setContainer({
			width: contentRect.bounds.width,
			height: Math.round(contentRect.bounds.width / aspectRatio),
		});
	};

	const handleCanPlay = () => {
		calculateRatio(videoRef.current.videoHeight, videoRef.current.videoWidth);
		setIsVideoPlaying(true);
		videoRef.current.play();
	};

	const handleCapture = () => {
		const context = canvasRef.current.getContext('2d');

		context.drawImage(
			videoRef.current,
			offsets.x,
			offsets.y,
			container.width,
			container.height,
			0,
			0,
			container.width,
			container.height
		);

		canvasRef.current.toBlob(
			(blob) => {
				const reader = new FileReader();
				let base64data = null;
				reader.readAsDataURL(blob);
				reader.onloadend = () => {
					base64data = reader.result;
					onCapture({ image: URL.createObjectURL(blob), base64: base64data });
				};
			},
			'image/jpeg',
			1
		);
		setIsFlashing(true);
	};

	/* const handleClear = () => {
    const context = canvasRef.current.getContext('2d')
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    setIsFlashing(false)
    onClear()
  } */

	if (!mediaStream) {
		return null;
	}

	return (
		<>
			<Measure bounds onResize={handleResize}>
				{({ measureRef }) => (
					<>
						<Row className="camera__wrapper">
							<Col
								className="camera__container"
								ref={measureRef}
								style={{
									height: `${container.height}px`,
									maxHeight: `${videoRef?.current?.videoHeight}px`,
									maxWidth: `${videoRef?.current?.videoWidth}px`,
								}}
							>
								<video
									className="camera__video"
									ref={videoRef}
									hidden={!isVideoPlaying}
									onCanPlay={handleCanPlay}
									autoPlay
									playsInline
									muted
									style={{
										top: `-${offsets.y}px`,
										left: `-${offsets.x}px`,
									}}
								/>

								<div className="camera__overlay" hidden={!isVideoPlaying} />

								<canvas
									className="camera__canvas"
									ref={canvasRef}
									width={container.width}
									height={container.height}
								/>

								<div
									className={`camera__flash ${
										isFlashing ? 'flashAnimation' : ''
									}`}
									hidden={!isVideoPlaying}
								/>
							</Col>
						</Row>
						{isVideoPlaying && (
							<Row justify="end" className="mt-4">
								<Col>
									<Button
										type="primary"
										onClick={handleCapture}
										className="big-button"
									>
										Capturar
									</Button>
								</Col>
							</Row>
						)}
					</>
				)}
			</Measure>
		</>
	);
};

export default Camera;
