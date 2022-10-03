/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.createTable('albums', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    name: {
      type: 'TEXT',
      notNull: true
    },
    year: {
      type: 'INT',
      notNull: true
    }
  })
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    title: {
      type: 'TEXT',
      notNull: true
    },
    year: {
      type: 'INT',
      notNull: true
    },
    performer: {
      type: 'TEXT',
      notNull: true
    },
    genre: {
      type: 'TEXT',
      notNull: true
    },
    duration: {
      type: 'INT',
      notNull: true
    },
    album_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"albums"',
      onDelete: 'cascade'
    }
  })
}

exports.down = pgm => {
  pgm.dropTable('albums')
  pgm.dropTable('songs')
}