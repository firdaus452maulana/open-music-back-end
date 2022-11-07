// const ClientError = require('../../exceptions/ClientError')

class SongHandler {
  constructor (playlistsService, playlistSongsService, playlistSongActivitiesService, validator) {
    this._playlistsService = playlistsService
    this._playlistSongsService = playlistSongsService
    this._playlistSongActivitiesService = playlistSongActivitiesService
    this._validator = validator

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this)
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this)
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this)
    this.addSongPlaylistHandler = this.addSongPlaylistHandler.bind(this)
    this.getSongByPlaylistIdHandler = this.getSongByPlaylistIdHandler.bind(this)
    this.deleteSongPlaylistByIdHandler = this.deleteSongPlaylistByIdHandler.bind(this)
    this.getActivitiesByPlaylistIdHandler = this.getActivitiesByPlaylistIdHandler.bind(this)
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

    await this._playlistsService.verifyPlaylistOwner({ id, owner: credentialId })
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

    await this._playlistsService.verifyPlaylistAccess({ playlistId: id, userId: credentialId })
    await this._playlistSongsService.addPlaylistSong({ playlistId: id, songId })
    await this._playlistSongActivitiesService.addActivity({ playlistId: id, songId, userId: credentialId, action: 'add' })

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke dalam Playlist'
    })
    response.code(201)
    return response
  }

  async getSongByPlaylistIdHandler (request, h) {
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials

    await this._playlistsService.verifyPlaylistAccess({ playlistId: id, userId: credentialId })
    const playlist = await this._playlistsService.getPlaylistById(id)
    const song = await this._playlistSongsService.getSongsByPlaylist(id)

    playlist.songs = song

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

    await this._playlistsService.verifyPlaylistAccess({ playlistId: id, userId: credentialId })
    await this._playlistSongsService.deleteSongFromPlaylistById(songId)
    await this._playlistSongActivitiesService.addActivity({ playlistId: id, songId, userId: credentialId, action: 'delete' })

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus'
    }
  }

  async getActivitiesByPlaylistIdHandler (request, h) {
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials

    await this._playlistsService.verifyPlaylistAccess({ playlistId: id, userId: credentialId })
    const activities = await this._playlistSongActivitiesService.getActivity(id)

    return {
      status: 'success',
      data: {
        playlistId: id,
        activities
      }
    }
  }
}

module.exports = SongHandler
