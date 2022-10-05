// mengimpor dotenv dan menjalankan konfigurasinya
require('dotenv').config()

const Hapi = require('@hapi/hapi')
const albums = require('./api/album')
const AlbumsService = require('./services/postgres/AlbumsService')
const { AlbumsValidator, SongsValidator } = require('./validator/album')

const init = async () => {
  const notesService = new AlbumsService()
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
      service: notesService,
      validator: AlbumsValidator
    }
  })

  await server.start()
  console.log(`Server berjalan pada ${server.info.uri}`)
}

init()
