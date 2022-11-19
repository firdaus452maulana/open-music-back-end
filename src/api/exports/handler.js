class ExportsHandler {
  constructor (producerService, playlistsService, validator) {
    this._producerService = producerService
    this._playlistsService = playlistsService
    this._validator = validator

    this.postExportPlaylistsHandler = this.postExportPlaylistsHandler.bind(this)
  }

  async postExportPlaylistsHandler (request, h) {
    this._validator.validateExportPlaylistsPayload(request.payload)
    const { playlistId } = request.params
    const { id: credentialId } = request.auth.credentials

    await this._playlistsService.verifyPlaylistAccess({ playlistId, userId: credentialId })
    const message = {
      userId: credentialId,
      playlistId,
      targetEmail: request.payload.targetEmail
    }

    await this._producerService.sendMessage('export:playlists', JSON.stringify(message))

    return h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
      playlistId
    }).code(201)
  }
}

module.exports = ExportsHandler
