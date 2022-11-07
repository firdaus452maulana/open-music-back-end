const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')

class PlaylistsService {
  constructor () {
    this._pool = new Pool()
  }

  async addPlaylistSong ({ playlistId, songId }) {
    const id = 'playlistSong-' + nanoid(16)
    const createdAt = new Date().toISOString()
    const updatedAt = createdAt

    const querySong = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [songId]
    }

    const resultSong = await this._pool.query(querySong)
    if (!resultSong.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan')
    }

    // Kirim data ke DB menggunakan SQL
    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, playlistId, songId, createdAt, updatedAt]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan ke dalam playlist')
    }

    return result.rows[0].id
  }

  async getSongsByPlaylist (playlistId) {
    // const query = {
    //   text: `SELECT playlist.*, playlists.*, songs.id, songs.title, songs.performer FROM playlist_songs
    //     JOIN playlists ON playlists.id = playlist.playlist_id
    //     JOIN songs ON songs.id = playlist.song_id
    //     WHERE playlists.playlist_id = $1
    //     GROUP BY playlists.id`,
    //   values: [playlistId]
    // }

    const query = {
      text: `SELECT songs.id, songs.title, songs.performer FROM playlist_songs
        JOIN songs ON songs.id = song_id
        WHERE playlist_id = $1`,
      values: [playlistId]
    }

    const result = await this._pool.query(query)

    return result.rows
  }

  async deleteSongFromPlaylistById (id) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE song_id = $1 RETURNING id',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan')
    }

    return result
  }
}

module.exports = PlaylistsService
