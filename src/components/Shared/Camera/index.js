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
import { Col, Row, Button, Typography, Card } from 'antd';
import b64toBlob from '../../../utils/b64ToFile/b64toBlob';

const { Title } = Typography;

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
	let fileElem = null;

	const onChangeUpload = ({ target }) => {
		const [fileItemIn] = target.files;

		if (fileItemIn) {
			const reader = new FileReader();
			reader.onloadend = (e) => {
				const fileBase64 = e.target.result;
				const block = fileBase64.split(';');
				const contentType = block[0].split(':')[1];
				const realData = block[1].split(',')[1];
				const img = b64toBlob(realData, contentType);
				onCapture({
					image: URL.createObjectURL(img),
					base64: {
						file: fileBase64,
						fileName: fileItemIn.name,
					},
				});
			};
			reader.readAsDataURL(fileItemIn);
		}
	};

	const activateListeners = () => {
		fileElem = document.getElementById('fileElem');
		fileElem.addEventListener('change', onChangeUpload, false);
		fileElem.click();
	};

	const takePhoto = () => {
		if (fileElem) {
			fileElem.click();
		} else {
			activateListeners();
		}
	};

	if (!mediaStream) {
		return (
			<Card className="inner-card">
				<Row>
					<Col className="text-align center" span={24}>
						<input
							accept="image/*"
							type="file"
							id="fileElem"
							style={{ display: 'none' }}
							capture
						/>
						<Button type="link" onClick={takePhoto} className="big-button">
							<Title level={4} className="text-primary m-0 p-0">
								Capturar
							</Title>
						</Button>
					</Col>
				</Row>
			</Card>
		);
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
									style={{ marginTop: '100px' }}
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
							<Row
								justify="end"
								className="mt-4"
								style={{
									position: 'sticky',
								}}
							>
								<Col>
									<Button
										type="primary"
										onClick={handleCapture}
										className="big-button"
									>
										<Title level={4} className="text-primary m-0 p-0">
											Capturar
										</Title>
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
