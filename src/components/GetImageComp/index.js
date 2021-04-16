import React, { useState } from 'react';

import Camera from '../Shared/Camera';
import { Col, Row, Image, Card, Button, Typography } from 'antd';

const { Title } = Typography;

const GetImageComp = () => {
	const [preview, setPreview] = useState();
	const [fileBase64, setFileBase64] = useState();
	const [isOpen, setIsOpen] = useState(true);
	const CameraExists =
		'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;

	console.log('====================================');
	console.log(fileBase64);
	console.log('====================================');

	if (!CameraExists) {
		return (
			<Card className="inner-card">
				<Row>
					<Col className="text-align center" span={24}>
						<Title>No cuenta con cámara en su dispositivo</Title>
					</Col>
				</Row>
			</Card>
		);
	}

	return (
		<>
			{isOpen && (
				<Row>
					<Col span={24}>
						<Camera
							onCapture={({ image, base64 }) => {
								setPreview(image);
								setFileBase64(base64);
								setIsOpen(!isOpen);
							}}
							onClear={() => setPreview(undefined)}
						/>
					</Col>
				</Row>
			)}
			{preview && (
				<Card className="inner-card">
					<Row justify="center" align="middle">
						<Col className="mb-2">
							<Button
								type="link"
								onClick={() => {
									setIsOpen(!isOpen);
									setPreview(null);
									setFileBase64(null);
								}}
								className="big-button"
							>
								<Title level={4} className="text-primary m-0 p-0">
									Volver a tomar
								</Title>
							</Button>
						</Col>
						<Col span={24}>
							<Image className="img-fluid img-rounded" src={preview} />
						</Col>
					</Row>
				</Card>
			)}
		</>
	);
};

export default GetImageComp;
