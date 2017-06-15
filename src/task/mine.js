/*
 * task Mine
 *
 * mine task harvestes the source for energy
 *
 */

var taskMine = {

    /**
    * @param {Creep} creep The creep object
    * @param {Task} task The work task passed from the work Queue
    **/
    doTask: function(creep, task) {
        if (!creep) { return ERR_INVALID_ARGS; }
        if (!task) { return ERR_INVALID_ARGS; }

        if (!creep.memory.harvestTarget) {
            if (C.DEBUG >= 2) { console.log('DEBUG - miner name:' + creep.name + ' has no harvest target'); }
            return false;
        }
        if (task.workRooms.length <= 0) {
            if (C.DEBUG >= 2) { console.log('DEBUG - missing work rooms on task: ' + task.task + ', id: ' + task.id); }
            return false;
        }

        if (creep.room.name != task.workRooms[0]) {
            creep.moveToRoom(task.workRooms[0]);
            return true;
        }

        switch (creep.memory.style) {
            case 'drop':
                this.doDropHarvest(creep);
                break;
            default:
                this.doHarvest(creep);
        }

        return true;
    },

    /**
    * @param {Task} task The work task passed from the work Queue
    **/
    doTaskManaged: function(task) {
        if (!task) { return ERR_INVALID_ARGS; }

        if (Game.Manage.task.cooldown(task)) { return true; }

        let count = _.filter(Game.creeps, creep =>
            creep.memory.workId == task.id &&
            creep.memory.despawn != true
            ).length;
        if (count < task.creepLimit) {
            if (task.spawnJob && !Game.Queue.getRecord(task.spawnJob)) {
                task.spawnJob = undefined;
            }

            if (!task.spawnJob) {
                let record = {
                    rooms: [ task.spawnRoom, ],
                    role: C.MINER,
                    priority: 50,
                    creepArgs: {
                        harvestTarget: task.targetId,
                        workRooms: task.workRooms,
                        workId: task.id,
                    },
                };

                let source = Game.getObjectById(task.targetId);

                if (source && source.getDropContainer()) {
                    record.creepArgs.style = 'drop';
                } else if (task.spawnRoom != task.workRooms[0]) {
                    record.creepArgs.style = 'ranged';
                }

                task.spawnJob = Game.Queue.spawn.addRecord(record);
            }
        }

        return true;
    },

    /**
    * @param {Room} room The room object
    **/
    doTaskFind: function(room) {
        if (!room) { return ERR_INVALID_ARGS; }
        // task creation for the room
    },

    /**
    * @param {Room} room The room object
    **/
    createTask: function(args, room) {
        return false;
    },

    doHarvest: function(creep) {
        if (!creep) { return ERR_INVALID_ARGS; }

        let source = Game.getObjectById(creep.memory.harvestTarget);

        if (!creep.pos.inRangeTo(source, 1)) {
            creep.goto(source, {
                range: 1,
                maxRooms:1,
                reUsePath: 80,
                maxOps: 4000,
                ignoreCreeps: true,
            });
            return true;
        }

        if (creep.carry[RESOURCE_ENERGY] > 0 && !source.getLocalContainer()) {
            let construction = creep.room.getConstructionAtArea(source.pos, 1);

            if (construction) {
                creep.build(construction);
                return true;
            }
        }

        creep.harvest(source);

        return true;
    },

    doDropHarvest: function(creep) {
        if (!creep) { return ERR_INVALID_ARGS; }

        let source = Game.getObjectById(creep.memory.harvestTarget);
        let target = Game.getObjectById(source.getDropContainer());

        if (!target) {
            if (C.DEBUG >= 3) { console.log('VERBOSE - drop container missing in room: ' + creep.room.name + ', creep: ' + creep.name); }
            source.clearContainer();
            creep.setDespawn();
            return false;
        }

        if (!creep.pos.isEqualTo(target)) {
            creep.goto(target, {
                range: 0,
                maxRooms:1,
                reUsePath: 80,
                maxOps: 4000,
            });
            return true;
        }

        if (_.sum(target.store) >= (target.storeCapacity * C.ENERGY_CONTAINER_MAX_PERCENT)) {
            return true;
        }

        creep.harvest(source);

        return true;
    },

};

module.exports = taskMine;
