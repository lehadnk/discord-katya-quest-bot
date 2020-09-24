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
  await db.createTable('taken_hints', {
    id: { type: 'int', primaryKey: true, autoIncrement: true},
    user_id: 'int',
    level: 'int',
    amount: 'int',
    penalty: 'int',
  });
};

exports.down = function(db) {
  return db.dropTable('taken_hints');
};

exports._meta = {
  "version": 1
};
