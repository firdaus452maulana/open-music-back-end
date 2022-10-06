// mengimpor dotenv dan menjalankan konfigurasinya
require('dotenv').config()

const Hapi = require('@hapi/hapi')
const albums = require('./api/album')
const AlbumsService = require('./services/postgres/AlbumsService')
const AlbumsValidator = require('./validator/album')
const songs = require('./api/song')
const SongsService = require('./services/postgres/SongsService')
const SongsValidator = require('./validator/song')

const init = async () => {
  const albumsService = new AlbumsService()
  const songsService = new SongsService()
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  await server.register({
    plugin: albums,
    options: {
      service: albumsService,
      validator: AlbumsValidator
    }
  })

  await server.register({
    plugin: songs,
    options: {
      service: songsService,
      validator: SongsValidator
    }
  })

  await server.start()
  console.log(`Server berjalan pada ${server.info.uri}`)
}

init()
