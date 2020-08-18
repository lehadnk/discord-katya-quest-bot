'use strict';

let dbm;
let type;
let seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = async function(db) {
  await db.createTable('questions', {
    id: { type: 'int', primaryKey: true, autoIncrement: true},
    text: 'text',
    hint: 'text',
    answers: 'text',
  });
};

exports.down = function(db) {
  return db.dropTable('questions');
};

exports._meta = {
  "version": 1
};
