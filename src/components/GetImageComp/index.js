import React, { useState } from 'react';

import Camera from '../Shared/Camera';
import { Col, Row, Image, Card, Button, Typography } from 'antd';

const { Title } = Typography;

const GetImageComp = () => {
	const [fileBase64, setFileBase64] = useState(null);
	const [isOpen, setIsOpen] = useState(true);
	/* const CameraExists =
		'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices; */

	console.log('====fileBase64================================');
	console.log(fileBase64);
	console.log('====================================');

	return (
		<>
			{isOpen && (
				<Row>
					<Col span={24}>
						<Camera
							onCapture={({ base64 }) => {
								setFileBase64(base64);
								setIsOpen(!isOpen);
							}}
						/>
					</Col>
				</Row>
			)}
			{fileBase64?.fileBase64 && (
				<Card className="inner-card">
					<Row justify="center" align="middle">
						<Col className="mb-2">
							<Button
								type="link"
								onClick={() => {
									setIsOpen(!isOpen);
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
							<Image
								className="img-fluid img-rounded"
								src={fileBase64?.fileBase64}
							/>
						</Col>
					</Row>
				</Card>
			)}
		</>
	);
};

export default GetImageComp;
