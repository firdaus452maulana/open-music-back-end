const Joi = require('joi')

const AddPlaylistPayloadSchema = Joi.object({
  name: Joi.string().required()
})

const AddSongPlaylistPayloadSchema = Joi.object({
  name: Joi.string().required()
})

module.exports = { AddPlaylistPayloadSchema, AddSongPlaylistPayloadSchema }
