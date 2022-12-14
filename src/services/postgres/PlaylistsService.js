const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')
const AuthorizationError = require('../../exceptions/AuthorizationError')

class PlaylistsService {
  constructor (CollaborationService) {
    this._pool = new Pool()
    this._collaborationService = CollaborationService
  }

  async verifyPlaylistOwner ({ id, owner }) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id]
    }
    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan')
    }
    const playlist = result.rows[0]
    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini')
    }
  }

  async verifyPlaylistAccess ({ playlistId, userId }) {
    try {
      await this.verifyPlaylistOwner({ id: playlistId, owner: userId })
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      try {
        await this._collaborationService.verifyCollaborator(playlistId, userId)
      } catch {
        throw error
      }
    }
  }

  async addPlaylist ({ name, owner }) {
    const id = 'playlist-' + nanoid(16)
    const createdAt = new Date().toISOString()
    const updatedAt = createdAt

    // Kirim data ke DB menggunakan SQL
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, owner, createdAt, updatedAt]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan')
    }

    return result.rows[0].id
  }

  async getPlaylist (userId) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username FROM playlists
        INNER JOIN users ON users.id = playlists.owner
        WHERE playlists.owner = $1 OR playlists.id = (SELECT playlist_id FROM collaborations WHERE user_id = $1)`,
      values: [userId]
    }

    const result = await this._pool.query(query)

    return result.rows
  }

  async getPlaylistById (id) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username FROM playlists
        INNER JOIN users ON users.id = owner
        WHERE playlists.id = $1`,
      values: [id]
    }

    const result = await this._pool.query(query)

    return result.rows[0]
  }

  async deletePlaylistById (id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan')
    }

    return result
  }
}

module.exports = PlaylistsService
