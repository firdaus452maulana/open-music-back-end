// const ClientError = require('../../exceptions/ClientError')

class SongHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    this.postSongHandler = this.postSongHandler.bind(this)
    this.getSongsHandler = this.getSongsHandler.bind(this)
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this)
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this)
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this)
    // autoBind(this)
  }

  async postSongHandler (request, h) {
    this._validator.validateSongPayload(request.payload)

    const songId = await this._service.addSong(request.payload)

    const response = h.response({
      status: 'success',
      message: 'Song berhasil ditambahkan',
      data: {
        songId
      }
    })
    response.code(201)
    return response
  }

  async getSongsHandler (request, h) {
    const songs = await this._service.getSongs(request.query)
    const songsArr = []

    songs.forEach(element => {
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
        songs: songsArr
      }
    }
  }

  async getSongByIdHandler (request, h) {
    const { id } = request.params
    const song = await this._service.getSongById(id)
    delete song.createdAt
    delete song.updatedAt
    return {
      status: 'success',
      data: {
        song
      }
    }
  }

  async putSongByIdHandler (request, h) {
    this._validator.validateSongPayload(request.payload)
    const { id } = request.params

    await this._service.editSongById(id, request.payload)

    return {
      status: 'success',
      message: 'Song berhasil diperbarui'
    }
  }

  async deleteSongByIdHandler (request, h) {
    const { id } = request.params
    await this._service.deleteSongById(id)

    return {
      status: 'success',
      message: 'Song berhasil dihapus'
    }
  }
}

module.exports = SongHandler
