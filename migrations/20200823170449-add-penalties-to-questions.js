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
  await db.addColumn('questions', 'complete_text', 'int');
  await db.addColumn('questions', 'hint2', 'text');
  await db.addColumn('questions', 'penalty', 'int');
  await db.addColumn('questions', 'penalty2', 'int');
};

exports.down = async function(db) {
  await db.removeColumn('questions', 'complete_text');
  await db.removeColumn('questions', 'hint2');
  await db.removeColumn('questions', 'penalty');
  await db.removeColumn('questions', 'penalty2');
};

exports._meta = {
  "version": 1
};
