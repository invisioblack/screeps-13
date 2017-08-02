/*
 * manage system
 *
 * handles loading and running of the manage modules
 *
 */

var manageRoom      = require('manage.room');
var manageCreep     = require('manage.creep');
var manageFlags     = require('manage.flags');

var Manage = function() {
    this.room   = new manageRoom;
    this.creep  = new manageCreep;
    this.flags  = new manageFlags;
};

Manage.prototype.run = function() {
    this.room.run();
    this.flags.run();
    this.creep.run();
};

module.exports = Manage;