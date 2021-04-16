/**
 * Convert a base64 string in a Blob according to the data and contentType.
 *
 * @o b64Data {String} Pure base64 string without contentType
 * @o contentType {String} the content type of the file i.e (image/jpeg - image/png - text/plain)
 * @o sliceSize {Int} SliceSize to process the byteCharacters
 * @o http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
 * @o Blob
 */
const b64toBlob = (b64Data, contentType, sliceSize) => {
  const type = contentType || ''
  const sSize = sliceSize || 512

  const byteCharacters = atob(b64Data)
  const byteArrays = []

  for (let offset = 0; offset < byteCharacters.length; offset += sSize) {
    const slice = byteCharacters.slice(offset, offset + sSize)

    const byteNumbers = new Array(slice.length)
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)

    byteArrays.push(byteArray)
  }

  const blob = new Blob(byteArrays, { type })
  return blob
}

export default b64toBlob
