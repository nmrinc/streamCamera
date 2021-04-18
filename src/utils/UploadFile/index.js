/* eslint-disable prefer-promise-reject-errors */

import { isEmpty } from 'lodash';
import LoadFileEntity from './LoadFileEntity';

let input = null;
class UploadFile {
	/**
	 *
	 * @description FUNCION PRIVADA, NO USAR
	 */
	_onChange_ = (event, fnOnLoad, maxSize, warningMsg) => {
		const { target } = event;
		const { files } = target;
		const file = isEmpty(files[0]) && files[0];
		if (!file) return console.error('error al cargar archivo');

		const reader = new FileReader();
		reader.readAsDataURL(file);

		let fileInfo = null;
		reader.onload = () => {
			fileInfo = new LoadFileEntity(file);
		};
		reader.onloadend = (e) => {
			/* const block = e.target.result.split(';')
      const realData = block[1].split(',')[1] */

			fileInfo.setBase64(e.target.result);
			document.getElementById('input_file').remove();
			if (fileInfo.size > maxSize) {
				this._onOverSize_(warningMsg);
			} else {
				fnOnLoad(fileInfo.get());
			}
		};

		return true;
	};

	_onOverSize_ = (warningMsg) => {
		alert(warningMsg);
	};

	/**
	 *  @description Carga un archivo del tipo de extensión indicada
	 *  y resuelve una funcion con los valores de la carga
	 * @returns  '{name, type, size, fileBase64}
	 *  @o El parámetro capture sirve para obtener la imagen con la cámara del móvil.
	 *  Es opcional y por default es false
	 */
	loadfileToBase64 = ({
		accept = '',
		fnOnLoad = () => null,
		maxSize = 10000,
		warningMsg = 'Max file size exceeded',
		capture = false,
	}) => {
		input = document.createElement('input');
		input.type = 'file';
		input.style = 'display:none';
		input.accept = accept;
		input.id = 'input_file';
		input.capture = capture;
		input.onchange = (e) => this._onChange_(e, fnOnLoad, maxSize, warningMsg);
		document.body.appendChild(input);
		input.click();
	};
}

export default UploadFile;
