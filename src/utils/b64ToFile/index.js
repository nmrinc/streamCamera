import blobToFile from './blobToFile'

let downLoadLink = null
let b64 = null

class DownloadImage {
  action = ({ file, name }) => {
    b64 = blobToFile(file.fileBase64)

    downLoadLink = document.createElement('a')
    downLoadLink.href = URL.createObjectURL(b64)
    downLoadLink.download = `${name}.${file.type.substr(file.type.length - 3)}`
    downLoadLink.click()
  }
}

export default DownloadImage
