/*
 * Set variables for managment
 *
 * ACTIVE: controls run loop
 * DEBUG: Report on values at runtime
 *
 * ENERGY_* values set upper and lower usage values
 *
 * LIMIT_* values max creep spawn per room
 *
 */

var Cli = {

    creep: {

        despawn: function(creepName) {
            if (!creepName) {
                console.log('ERROR - command need the following values: creepName');
                return false;
            }

            if (!Game.creeps[creepName]) {
                console.log('ERROR - ' + creepName + ' is not a valid creep');
                return false;
            }

            Game.creeps[creepName].memory.despawn = true;
            console.log('RESULT - ' + creepName + ' has been set to despawn');

            return true;
        },

        spawn: {

            controller: function(room) {
                if (!room) {
                    console.log('ERROR - command need the following values: room name');
                    return false;
                }

                let record = {
                    rooms: [ room, ],
                    role: 'controller',
                    priority: 30,
                };

                return Game.Queue.spawn.addRecord(record);
            },

            scout: function(room) {
                if (!room) {
                    console.log('ERROR - command need the following values: room name');
                    return false;
                }

                let record = {
                    rooms: [ room, ],
                    role: 'scout',
                    priority: 80,
                };

                return Game.Queue.spawn.addRecord(record);
            },

            combatbrawler: function(room) {
                if (!room) {
                    console.log('ERROR - command need the following values: room name');
                    return false;
                }

                let record = {
                    rooms: [ room, ],
                    role: 'combat.brawler',
                    priority: 36,
                };

                return Game.Queue.spawn.addRecord(record);
            },

        },

    },

    queue: {

        remove: function(id) {
            if (isNaN(id)) {
                console.log('ERROR - command need the following values: work id');
                return false;
            }

            return Game.Queue.delRecord(id);
        },

    },

    work: {

        reserve: function(room, spawn) {
            if (!room || !spawn) {
                console.log('ERROR - command need the following values: work room, spawn room');
                return false;
            }
            let record = {
                workRooms: [ room, ],
                spawnRoom: spawn,
                task: 'reserve',
                managed: true,
                priority: 70,
                creepLimit: 1,
            };

            return Game.Queue.work.addRecord(record);
        },

        claim: function(room) {
            if (!room) {
                console.log('ERROR - command need the following values: room name');
                return false;
            }
            let record = {
                workRooms: [ room, ],
                task: 'claim',
                priority: 20,
                creepLimit: 1,
            };

            return Game.Queue.work.addRecord(record);
        },

        scouting: function(room) {
            if (!room) {
                console.log('ERROR - command need the following values: room name');
                return false;
            }
            let record = {
                workRooms: [ room, ],
                task: 'scouting',
                priority: 90,
                creepLimit: 1,
            };

            return Game.Queue.work.addRecord(record);
        },

        attack: function(room, limit) {
            if (!room || isNaN(limit)) {
                console.log('ERROR - command need the following values: room name, creep limit');
                return false;
            }
            let record = {
                workRooms: [ room, ],
                task: 'attack',
                priority: 40,
                creepLimit: limit,
            };

            return Game.Queue.work.addRecord(record);
        },

        signcontroller: function(roomName, message) {
            if (!roomName || !message) {
                console.log('ERROR - command need the following values: room name, message');
                return false;
            }
            let record = {
                workRooms: [ roomName, ],
                task: 'signcontroller',
                priority: 40,
                creepLimit: 1,
                message: message,
            };

            return Game.Queue.work.addRecord(record);
        },

        haul: function(roomName, spawnRoom) {
            if (!roomName) {
                console.log('ERROR - command need the following values: work room, (opt) spawn room');
                return false;
            }
            spawnRoom = spawnRoom || roomName;
            let record = {
                workRooms: [ roomName, ],
                spawnRoom: spawnRoom,
                task: 'director.haul',
                priority: 22,
                creepLimit: 0,
                managed: true,
            };

            return Game.Queue.work.addRecord(record);
        },

        longhaul: function(roomName, spawnRoom) {
            if (!roomName || !spawnRoom) {
                console.log('ERROR - command need the following values: work room, spawn room');
                return false;
            }
            let record = {
                workRooms: [ roomName, ],
                spawnRoom: spawnRoom,
                task: 'longhaul',
                priority: 40,
                creepLimit: 0,
                managed: true,
            };

            return Game.Queue.work.addRecord(record);
        },

        upgrade: function(roomName, spawnRoom) {
            if (!roomName) {
                console.log('ERROR - command need the following values: work room, (opt) spawn room');
                return false;
            }
            spawnRoom = spawnRoom || roomName;
            let record = {
                workRooms: [ roomName, ],
                spawnRoom: spawnRoom,
                task: 'upgrade',
                priority: 26,
                creepLimit: 1,
                managed: true,
            };

            return Game.Queue.work.addRecord(record);
        },

        tech: function(roomName, spawnRoom) {
            if (!roomName) {
                console.log('ERROR - command need the following values: work room, (opt) spawn room');
                return false;
            }
            spawnRoom = spawnRoom || roomName;
            workRooms = Array.isArray(roomName) ? roomName : [ roomName ];
            let record = {
                workRooms: workRooms,
                spawnRoom: spawnRoom,
                task: 'director.tech',
                priority: 30,
                creepLimit: 1,
                managed: true,
            };

            return Game.Queue.work.addRecord(record);
        },

        spawnRoom: function(roomName) {
            if (!roomName) {
                console.log('ERROR - command need the following values: room name');
                return false;
            }
            let record = {
                workRooms: [ roomName, ],
                spawnRoom: roomName,
                task: 'director.room',
                priority: 20,
                creepLimit: 0,
                managed: true,
            };

            return Game.Queue.work.addRecord(record);
        },

        remoteRoom: function(roomName, spawnRoom) {
            if (!roomName) {
                console.log('ERROR - command need the following values: room name');
                return false;
            }
            spawnRoom = spawnRoom || roomName;
            let record = {
                workRooms: [ roomName, ],
                spawnRoom: spawnRoom,
                task: 'director.remote',
                priority: 30,
                creepLimit: 0,
                managed: true,
            };

            return Game.Queue.work.addRecord(record);
        },

        mine: function(roomName, spawnRoom) {
            if (!roomName) {
                console.log('ERROR - command need the following values: work room, (opt) spawn room');
                return false;
            }
            spawnRoom = spawnRoom || roomName;
            let record = {
                workRooms: [ roomName, ],
                spawnRoom: spawnRoom,
                task: 'director.mine',
                priority: 21,
                creepLimit: 0,
                managed: true,
            };

            return Game.Queue.work.addRecord(record);
        },

    },

}

module.exports = Cli;