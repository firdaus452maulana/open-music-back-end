/* eslint-disable camelcase */
const mapDBtoModelAlbum = ({
  id,
  name,
  year,
  created_at,
  updated_at
}) => ({
  id,
  name,
  year,
  createdAt: created_at,
  updatedAt: updated_at
})

const mapDBtoModelSong = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
  created_at,
  updated_at
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id,
  createdAt: created_at,
  updatedAt: updated_at
})

const mapDBtoModelPlaylist = ({
  id,
  name,
  owner,
  created_at,
  updated_at
}) => ({
  id,
  name,
  owner,
  createdAt: created_at,
  updatedAt: updated_at
})

module.exports = { mapDBtoModelAlbum, mapDBtoModelSong, mapDBtoModelPlaylist }
