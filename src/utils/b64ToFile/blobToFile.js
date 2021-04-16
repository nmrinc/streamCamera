import b64toBlob from './b64toBlob'

const blobToFile = ImageURL => {
  // Split the base64 string in data and contentType
  const block = ImageURL.split(';')
  // Get the content type of the image
  const contentType = block[0].split(':')[1] // In this case "image/gif"
  // get the real base64 content of the file
  const realData = block[1].split(',')[1] // In this case "R0lGODlhPQBEAPeoAJosM...."

  // Convert it to a blob to upload
  const blob = b64toBlob(realData, contentType)

  return blob
}

export default blobToFile
