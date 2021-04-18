import React, { useState } from 'react';
import { Col, Row, Image, Card, Button, Typography } from 'antd';
import UploadFile from '../../utils/UploadFile';

const { Title } = Typography;

const InputCapture = () => {
	const [preview, setPreview] = useState();
	const [isOpen, setIsOpen] = useState(true);

	const captureImage = () => {
		setIsOpen(!isOpen);
		const upload = new UploadFile();
		upload.loadfileToBase64({
			accept: '.jpg, .png, .pdf',
			fnOnLoad: (imagen) => {
				setPreview(imagen);
			},
			maxSize: 2000,
			capture: true,
		});
	};

	return (
		<>
			{isOpen && (
				<Row>
					<Col span={24}>
						<div className="default-photo-box mb-3" />
						<Button type="link" onClick={captureImage} className="big-button">
							<Title level={4} className="text-primary m-0 p-0">
								Capturar
							</Title>
						</Button>
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
								}}
								className="big-button"
							>
								<Title level={4} className="text-primary m-0 p-0">
									Volver a tomar
								</Title>
							</Button>
						</Col>
						<Col span={24}>
							<Title level={3}>
								Name:
								{preview.name}
							</Title>
							<Title level={3}>
								Size:
								{preview.size}
							</Title>
							<Title level={3}>
								Type:
								{preview.type}
							</Title>
							<Image
								className="img-fluid img-rounded"
								src={preview.fileBase64}
							/>
						</Col>
					</Row>
				</Card>
			)}
		</>
	);
};

export default InputCapture;
