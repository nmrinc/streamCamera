/**
 * @concept COMPONENTE QUE UTILIZA LA CÁMARA DEL DISPOSITIVO
 * @context Revisa si existe un dispositivo y tiene acceso para detonar la captura.
 * @context De igual manera si el usuario utiliza móvil o desktop
 * ----------------------------------------------------------------
 * @o Utiliza los hooks :
 * useUserMedia
 * useCardRatio
 * useOffsets
 * @o También las librerías:
 * react-measure
 *
 * ----------------------------------------------------------------
 * @data Retorna:
 * @fields image: Una imagen blob para pintar la previsualización
 * @fields base64: Un String base64 para envío
 */

import React, { useState, useRef } from 'react';
import { isMobile } from 'react-device-detect';
import Measure from 'react-measure';
import moment from 'moment';
import useUserMedia from '../../../hooks/camera/use-user-media';
import useCardRatio from '../../../hooks/camera/use-card-ratio';
import useOffsets from '../../../hooks/camera/use-offsets';
import { Col, Row, Button, Typography, Card } from 'antd';
import UploadFile from '../../../utils/UploadFile';

const { Title } = Typography;

const CAPTURE_OPTIONS = {
	audio: false,
	video: { facingMode: 'environment' },
	isMobile,
};

const Camera = ({ onCapture }) => {
	const canvasRef = useRef(null);
	const videoRef = useRef(null);

	const [container, setContainer] = useState({ width: 0, height: 0 });
	const [isVideoPlaying, setIsVideoPlaying] = useState(false);
	const [isFlashing, setIsFlashing] = useState(false);

	let mediaStream = useUserMedia(CAPTURE_OPTIONS);
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

		canvasRef.current.toBlob((blob) => {
			const reader = new FileReader();
			let base64data = null;
			reader.readAsDataURL(blob);
			reader.onloadend = () => {
				base64data = reader.result;
				const block = base64data.split(';');
				const type = block[0].split(':')[1];
				onCapture({
					base64: {
						fileBase64: base64data,
						name: `${moment().format('YYYY_MM_DDTHH_mm')}.${
							type.split('/')[1]
						}`,
						size: '',
						type,
					},
				});
			};
		}, 'image/jpeg');
		setIsFlashing(true);
	};

	/* const handleClear = () => {
    const context = canvasRef.current.getContext('2d')
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    setIsFlashing(false)
    onClear()
  } */

	const captureImage = () => {
		const upload = new UploadFile();
		upload.loadfileToBase64({
			accept: 'image/*',
			fnOnLoad: (imagen) => {
				onCapture({
					image: imagen.fileBase64,
					base64: imagen,
				});
			},
			maxSize: 2000,
			capture: 'environment',
			warningMsg:
				'Peso máximo de 2Mb, por favor reduzca la resolución de su cámara.',
		});
	};

	if (isMobile || !mediaStream) {
		return (
			<Card className="inner-card">
				<Row>
					<Col className="text-align center" span={24}>
						<Button type="link" onClick={captureImage} className="big-button">
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
