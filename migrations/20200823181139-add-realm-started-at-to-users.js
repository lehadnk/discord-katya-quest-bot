'use strict';

var dbm;
var type;
var seed;

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
  await db.addColumn('users', 'realm', 'string');
  await db.addColumn('users', 'started_at', 'int');
};

exports.down = async function(db) {
  await db.removeColumn('users', 'realm');
  await db.removeColumn('users', 'started_at');
};

exports._meta = {
  "version": 1
};
