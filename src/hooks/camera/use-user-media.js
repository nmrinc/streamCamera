import { useState, useEffect } from 'react';

const useUserMedia = (requestedMedia) => {
	const [mediaStream, setMediaStream] = useState(null);

	useEffect(() => {
		async function enableVideoStream() {
			try {
				const stream = await navigator.mediaDevices.getUserMedia(
					requestedMedia
				);
				setMediaStream(stream);
			} catch (err) {
				console.log('====================================');
				console.log(err);
				console.log('====================================');
			}
		}

		if (!mediaStream) {
			enableVideoStream();
		} else {
			return function cleanup() {
				mediaStream.getTracks().forEach((track) => {
					track.stop();
				});
			};
		}
		return null;
	}, [mediaStream, requestedMedia]);

	return mediaStream;
};

export default useUserMedia;
