// const ClientError = require('../../exceptions/ClientError')

class SongHandler {
  constructor (playlistsService, playlistSongsService, validator) {
    this._playlistsService = playlistsService
    this._playlistSongsService = playlistSongsService
    this._validator = validator

    this.postSongHandler = this.postSongHandler.bind(this)
    this.getSongsHandler = this.getSongsHandler.bind(this)
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this)
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this)
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this)
    // autoBind(this)
  }

  async postPlaylistHandler (request, h) {
    this._validator.validateAddPlaylistPayloadSchema(request.payload)
    const { name } = request.payload
    const { id: credentialId } = request.auth.credentials

    const playlistId = await this._playlistsService.addPlaylist({ name, owner: credentialId })

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId
      }
    })
    response.code(201)
    return response
  }

  async getPlaylistsHandler (request, h) {
    const { id: credentialId } = request.auth.credentials
    const playlists = await this._playlistsService.getPlaylist(credentialId)

    return {
      status: 'success',
      data: {
        playlists
      }
    }
  }

  async deletePlaylistByIdHandler (request, h) {
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials

    await this._playlistsService.verifyPlaylistOwner({ id, credentialId })
    await this._playlistsService.deletePlaylistById(id)

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus'
    }
  }

  async addSongPlaylistHandler (request, h) {
    this._validator.validateAddSongPlaylistPayloadSchema(request.payload)
    const { songId } = request.payload
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials

    await this._playlistsService.verifyPlaylistAccess({ id, credentialId })
    await this._playlistSongsService.addPlaylistSong({ id, songId })

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke dalam Playlist'
    })
    response.code(201)
    return response
  }

  async getSongByPlaylistIdHandler (request, h) {
    const { id } = request.params
    const playlist = await this._playlistSongsService.getSongsByPlaylist(id)

    return {
      status: 'success',
      data: {
        playlist
      }
    }
  }

  async deleteSongPlaylistByIdHandler (request, h) {
    this._validator.validateAddSongPlaylistPayloadSchema(request.payload)
    const { songId } = request.payload
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials

    await this._playlistsService.verifyPlaylistAccess({ id, credentialId })
    await this._playlistSongsService.deleteSongFromPlaylistById(songId)

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus'
    }
  }
}

module.exports = SongHandler
