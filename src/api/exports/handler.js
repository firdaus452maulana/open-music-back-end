class ExportsHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    this._postExportPlaylistsHandler = this.postExportPlaylistsHandler.bind(this)
  }

  async postExportPlaylistsHandler (request, h) {
    this._validator.validateExportNotesPayload(request.payload)
    const { playlistId } = request.params
    const message = {
      userId: request.auth.credentials.id,
      playlistId,
      targetEmail: request.payload.targetEmail
    }

    await this._service.sendMessage('export:playlists', JSON.stringify(message))

    return h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        status: 'success',
        message: 'Permintaan Anda dalam antrean',
        playlistId
      }
    }).code(201)
  }
}

module.exports = ExportsHandler
