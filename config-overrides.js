const { override, addLessLoader } = require('customize-cra');

module.exports = override(
	console.log('Override!'),
	addLessLoader({
		javascriptEnabled: true,
	})
);
