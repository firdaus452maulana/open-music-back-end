const { Pool } = require('pg')
const { nanoid } = require('nanoid')

const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')

class PlaylistSongActivitiesService {
  constructor () {
    this._pool = new Pool()
  }

  async addActivity ({ playlistId, songId, userId, action }) {
    const id = `playlistActivity-${nanoid(16)}`
    const time = new Date()
    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, time]
    }
    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new InvariantError('Aktifitas gagal direkam')
    }
    return result.rows[0].id
  }

  async getActivity (playlistId) {
    const queryPlaylist = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId]
    }
    const resultPlaylist = await this._pool.query(queryPlaylist)
    if (!resultPlaylist.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan')
    }

    const query = {
      text: `SELECT users.username, songs.title, playlist_song_activities.action, playlist_song_activities.time FROM playlist_song_activities
      INNER JOIN songs ON songs.id = playlist_song_activities.song_id
      INNER JOIN users ON users.id = playlist_song_activities.user_id
      WHERE playlist_song_activities.playlist_id = $1`,
      values: [playlistId]
    }

    const result = await this._pool.query(query)

    return result.rows
  }
}

module.exports = PlaylistSongActivitiesService
