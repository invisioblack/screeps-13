/*
 * task Director Tech
 *
 * director tech task handles the spawning od tech units
 *
 */

var taskDirectorTech = {

    /**
    * @param {Creep} creep The creep object
    * @param {Task} task The work task passed from the work Queue
    **/
    doTask: function(creep, task) {
        if (!creep) { return -1; }
        if (!task) { return -1; }
        // run creep task
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

        for (let i = 0; i < task.workRooms.length; i++ ) {
            if (!Game.rooms[task.workRooms[i]]) { continue; }
            let room = Game.rooms[task.workRooms[i]];

            let remoteTasks = [
                C.REPAIR,
                C.CONSTRUCTION,
            ];
            Game.Queue.work.doTaskFind(room, remoteTasks);

            if (!room.controller || !room.controller.my) { continue; }

            switch (room.controller.level) {
                case 1:
                case 2:
                    task.minSize = task.minSize != 200 ? 200 : task.minSize;
                    task.maxSize = task.maxSize != 300 ? 300 : task.maxSize;
                    task.creepLimit = task.creepLimit < 1 ? 1 : task.creepLimit;
                    break;
                case 3:
                    task.minSize = task.minSize != 300 ? 300 : task.minSize;
                    task.maxSize = task.maxSize != 400 ? 400 : task.maxSize;
                    break;
                case 4:
                    task.creepLimit = task.creepLimit < 2 ? 2 : task.creepLimit;
                    break;
                case 5:
                case 6:
                    task.minSize = task.minSize != 400 ? 400 : task.minSize;
                    task.maxSize = task.maxSize != 500 ? 500 : task.maxSize;
                    break;
                case 7:
                case 8:
                    task.minSize = task.minSize != 400 ? 400 : task.minSize;
                    task.maxSize = task.maxSize < 9999 ? 9999 : task.maxSize;
            }
        }

        // spawn new creeps if needed
        let count = _.filter(Game.creeps, creep =>
            creep.memory.directorId == task.id &&
            creep.memory.despawn != true
            ).length;
        if (count < task.creepLimit) {
            if (!Game.Queue.spawn.isQueued({ role: C.TECH, directorId: task.id, })) {
                let record = {
                    rooms: [ task.spawnRoom, ],
                    role: C.TECH,
                    priority: 54,
                    creepArgs: {
                        workRooms: task.workRooms,
                        directorId: task.id,
                    },
                };
                if (task.minSize) { record.minSize = task.minSize; }
                if (task.maxSize) { record.maxSize = task.maxSize; }
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

module.exports = taskDirectorTech;
