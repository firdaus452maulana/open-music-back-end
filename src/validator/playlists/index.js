const { AddPlaylistPayloadSchema, AddSongPlaylistPayloadSchema } = require('./schema')
const InvariantError = require('../../exceptions/InvariantError')

const PlaylistsValidator = {
  validateAddPlaylistPayloadSchema: (payload) => {
    const validationResult = AddPlaylistPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
  validateAddSongPlaylistPayloadSchema: (payload) => {
    const validationResult = AddSongPlaylistPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}

module.exports = PlaylistsValidator
