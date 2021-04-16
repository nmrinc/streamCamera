/**
 * @description PeriodConfig
 */
class LoadFileEntity {
  constructor({ name, type, size }) {
    this.name = name
    this.type = type
    this.size = Number(`${Math.round(size / 1000)}`)
    this.fileBase64 = null
  }

  setBase64 = fbase64 => {
    this.fileBase64 = fbase64
  }

  get = () => {
    const obj = { ...this }
    delete obj.get
    delete obj.setBase64
    return obj
  }
}

export default LoadFileEntity
