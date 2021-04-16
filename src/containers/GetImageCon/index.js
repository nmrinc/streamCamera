import React from 'react';
import { Row, Col, Card } from 'antd';

import GetImageComp from '../../components/GetImageComp';

const GetImageCon = () => {
	return (
		<>
			<Row justify="space-around" align="middle">
				<Col xs={24} md={18} lg={14} xl={9}>
					<Card className="card-container">
						<GetImageComp />
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default GetImageCon;
