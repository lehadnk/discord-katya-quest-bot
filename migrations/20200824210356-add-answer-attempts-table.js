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
  await db.createTable('answer_attempts', {
    id: { type: 'int', primaryKey: true, autoIncrement: true},
    user_id: 'int',
    level: 'int',
    given_at: 'int',
    is_correct: 'int',
    answer: 'string',
  });

  db.addIndex('answer_attempts', 'answer_attempts_user_id', ['user_id']);
  db.addIndex('answer_attempts', 'answer_attempts_level', ['level']);
};

exports.down = async function(db) {
  await db.dropTable('answer_attempts');
};

exports._meta = {
  "version": 1
};
