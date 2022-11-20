const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')
const { mapDBtoModelAlbum, mapDBtoModelSong } = require('../../utils')

class AlbumsService {
  constructor () {
    this._pool = new Pool()
  }

  async addAlbum ({ name, year }) {
    const id = 'album-' + nanoid(16)
    const createdAt = new Date().toISOString()

    // Kirim data ke DB menggunakan SQL
    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $4) RETURNING id',
      values: [id, name, year, createdAt]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan')
    }

    return result.rows[0].id
  }

  async getAlbumById (id) {
    const queryAlbum = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id]
    }

    const querySong = {
      text: 'SELECT * FROM songs WHERE album_id = $1',
      values: [id]
    }
    const resultAlbum = await this._pool.query(queryAlbum)
    const resultSong = await this._pool.query(querySong)

    if (!resultAlbum.rowCount) {
      throw new NotFoundError('Album tidak ditemukan')
    }

    const result = {
      album: resultAlbum.rows.map(mapDBtoModelAlbum)[0],
      songs: resultSong.rows.map(mapDBtoModelSong)
    }

    return result
  }

  async editAlbumById (id, { name, year }) {
    const updatedAt = new Date().toISOString()
    // Kirim data ke DB menggunakan SQL
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Album tidak ditemukan')
    }

    return result.rows[0].id
  }

  async deleteAlbumById (id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan')
    }

    return result
  }

  async updateAlbumCover (id, { filename }) {
    const updatedAt = new Date().toISOString()

    const query = {
      text: 'UPDATE albums SET cover_url = $1, updated_at = $2 WHERE id = $3 RETURNING id',
      values: [filename, updatedAt, id]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Album tidak ditemukan')
    }

    return result.rows[0].id
  }
}

module.exports = AlbumsService
