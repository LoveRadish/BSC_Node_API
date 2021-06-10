'use strict';
module.exports = function(app) {
  var transferList = require('../controllers/controllers');

  app.route('/*')
    .get(transferList.list_all_transfers);

};