import { useState, useEffect } from 'react';

const useUserMedia = (requestedMedia) => {
	const [mediaStream, setMediaStream] = useState(null);

	useEffect(() => {
		async function enableVideoStream() {
			try {
				if (!requestedMedia.isMobile) {
					const stream = await navigator.mediaDevices.getUserMedia(
						requestedMedia
					);
					setMediaStream(stream);
				} else {
					setMediaStream('');
				}
			} catch (err) {
				console.log('====err================================');
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
