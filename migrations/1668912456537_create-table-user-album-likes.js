/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = (pgm) => {
  // membuat table user_album_likes
  pgm.createTable('user_album_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    album_id: {
      type: 'VARCHAR(50)',
      notNull: true
    }
  })
}

exports.down = (pgm) => {
  // menghapus tabel user_album_likes
  pgm.dropTable('user_album_likes')
}
