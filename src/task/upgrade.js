/*
 * task Upgrade
 *
 * upgrade task upgrades the room controller
 *
 */

var taskUpgrade = {

    /**
    * @param {Creep} creep The creep object
    * @param {Task} task The work task passed from the work Queue
    **/
    doTask: function(creep, task) {
        if (!creep) { return -1; }
        if (!task) { return -1; }

        if (task.workRooms.length <= 0) {
            if (C.DEBUG >= 2) { console.log('DEBUG - missing work rooms on task: ' + task.task + ', id: ' + task.id); }
            return false;
        }

        if (creep.room.name != task.workRooms[0]) {
            creep.moveToRoom(task.workRooms[0]);
            return true;
        }

        if (!creep.pos.inRangeTo(creep.room.controller, 3)) {
            let args = {
                range: 3,
                reusePath: 30,
                maxRooms: 1,
            };
            creep.goto(creep.room.controller, args);
            return true;
        }

        creep.upgradeController(creep.room.controller)
        return true;
    },

    /**
    * @param {Task} task The work task passed from the work Queue
    **/
    doTaskManaged: function(task) {
        if (!task) { return -1; }

        task.manageTick = task.manageTick || 0;
        if ((task.manageTick + C.MANAGE_WAIT_TICKS) > Game.time) {
            return true;
        }
        task.manageTick = Game.time;

        if (task.workRooms.length <= 0) {
            if (C.DEBUG >= 2) { console.log('DEBUG - missing work rooms on task: ' + task.task + ', id: ' + task.id); }
            return false;
        }
        let room = Game.rooms[task.workRooms[0]];
        if (!room) {
            if (C.DEBUG >= 3) { console.log('VERBOSE - no eyes on room: ' + task.workRooms[0] + ', task: ' + task.task + ', id: ' + task.id); }
            return true;
        }

        // set size limits
        switch (room.controller.level) {
            case 1:
            case 2:
                task.minSize = task.minSize < 200 ? 200 : task.minSize;
                break;
            case 3:
                task.minSize = task.minSize < 300 ? 300 : task.minSize;
                break;
            case 4:
            case 5:
                task.minSize = task.minSize < 400 ? 400 : task.minSize;
                break;
            case 6:
            case 7:
            case 8:
                task.minSize = task.minSize < 600 ? 600 : task.minSize;
                break;
        }

        // set spawn limits
        task.creepLimit = task.creepLimit < 1 ? 1 : task.creepLimit;
        if (room.storage && room.controller.level < 8) {
            if (room.storage.store[RESOURCE_ENERGY] < 100000 ) {
                task.creepLimit = task.creepLimit != 1 ? 1 : task.creepLimit;
            } else if (room.storage.store[RESOURCE_ENERGY] < 300000 ) {
                task.creepLimit = task.creepLimit != 2 ? 2 : task.creepLimit;
            } else if (room.storage.store[RESOURCE_ENERGY] < 500000 ) {
                task.creepLimit = task.creepLimit != 3 ? 3 : task.creepLimit;
            } else if (room.storage.store[RESOURCE_ENERGY] < 800000 ) {
                task.creepLimit = task.creepLimit != 4 ? 4 : task.creepLimit;
            } else {
                task.creepLimit = task.creepLimit != 5 ? 5 : task.creepLimit;
            }
        } else if (room.controller.level == 8 ) {
            task.creepLimit = task.creepLimit != 1 ? 1 : task.creepLimit;
            task.rcl8 = task.rcl8 ? task.rcl8 : 1;
        } else {
            task.creepLimit = task.creepLimit < 2 ? 2 : task.creepLimit;
        }
        if (C.SIM) { task.creepLimit = 1 };

        // spawn new creeps if needed
        let count = _.filter(Game.creeps, creep =>
            creep.memory.workId == task.id &&
            creep.memory.despawn != true
            ).length;
        if (count < task.creepLimit) {
            if (!Game.Queue.spawn.isQueued({ role: C.UPGRADER, workId: task.workId, })) {
                let record = {
                    rooms: [ task.spawnRoom, ],
                    role: C.UPGRADER,
                    priority: 60,
                    creepArgs: {
                        workRooms: task.workRooms,
                        workId: task.workId,
                    },
                };
                if (task.minSize) { record.minSize = task.minSize; }
                if (task.rcl8) { record.style = 'rcl8'; }
                Game.Queue.spawn.addRecord(record);
            }
        }

        return true;
    },

    /**
    * @param {Room} room The room object
    **/
    doTaskFind: function(room) {
        if (!room) { return -1; }
        // task creation for the room
    },

};

module.exports = taskUpgrade;
