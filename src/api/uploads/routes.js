const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums/{id}/covers',
    handler: handler.postUploadImageHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 512000
      }
    }
  },
  {
    method: 'GET',
    path: '/albums/covers/{file*}',
    handler: {
      directory: {
        path: 'src/api/uploads/file/images'
      }
    }
  }
]

module.exports = routes
