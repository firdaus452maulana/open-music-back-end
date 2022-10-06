// const autoBind = require('auto-bind')
// const ClientError = require('../../exceptions/ClientError')

class AlbumHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    this.postAlbumHandler = this.postAlbumHandler.bind(this)
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this)
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this)
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this)
    // autoBind(this)
  }

  async postAlbumHandler (request, h) {
    this._validator.validateAlbumPayload(request.payload)
    const { name, year } = request.payload

    const albumId = await this._service.addAlbum({ name, year })

    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId
      }
    })
    response.code(201)
    return response
  }

  async getAlbumByIdHandler (request, h) {
    const { id } = request.params
    const result = await this._service.getAlbumById(id)
    const album = result.album
    const songsArr = []
    result.songs.forEach(element => {
      const data = {
        id: element.id,
        title: element.title,
        performer: element.performer
      }
      songsArr.push(data)
    })

    return {
      status: 'success',
      data: {
        album: {
          id: album.id,
          name: album.name,
          year: album.year,
          songs: songsArr
        }
      }
    }
  }

  async putAlbumByIdHandler (request, h) {
    this._validator.validateAlbumPayload(request.payload)
    const { id } = request.params

    await this._service.editAlbumById(id, request.payload)

    return {
      status: 'success',
      message: 'Album berhasil diperbarui'
    }
  }

  async deleteAlbumByIdHandler (request, h) {
    const { id } = request.params
    await this._service.deleteAlbumById(id)

    return {
      status: 'success',
      message: 'Album berhasil dihapus'
    }
  }
}

module.exports = AlbumHandler
