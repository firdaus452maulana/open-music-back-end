class UploadsHandler {
  constructor (uploadService, albumsService, validator) {
    this._uploadService = uploadService
    this._albumsService = albumsService
    this._validator = validator

    this.postUploadImageHandler = this.postUploadImageHandler.bind(this)
  }

  async postUploadImageHandler (request, h) {
    const { cover } = request.payload
    const { id } = request.params
    this._validator.validateAlbumCovers(cover.hapi.headers)

    let filename = await this._uploadService.writeFile(cover, cover.hapi)
    filename = 'http://' + process.env.HOST + ':' + process.env.PORT + '/albums/covers/' + filename
    await this._albumsService.updateAlbumCover(id, { filename })

    return h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah'
    }).code(201)
  }
}

module.exports = UploadsHandler
