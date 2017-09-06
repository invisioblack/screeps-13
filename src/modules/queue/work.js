/*
 * work queue system
 *
 * queue for the managment of work tasks
 *
 */

var logger = new Logger('[Queue Work]');
logger.level = C.LOGLEVEL.INFO;

var WorkQueue = function() {
    // init
};

WorkQueue.prototype.getQueue = function() {
    return getQueue({queue: C.QUEUE_WORK, });
};

WorkQueue.prototype.isQueued = function(args) {
    if (!args) { return ERR_INVALID_ARGS; }

    return _.filter(this.getQueue(), record =>
        (!args.targetId || record.targetId == args.targetId)
    ).length > 0 ? true : false;
};

WorkQueue.prototype.addRecord = function(args) {
    if (!args || !args.workRoom) {
        return ERR_INVALID_ARGS;
    }

    if (C.WORK_TYPES.indexOf(args.task) < 0) {
        return ERR_INVALID_ARGS;
    }

    args.priority = args.priority || 100;
    args.creepLimit = args.creepLimit || 0;

    let record = {
        queue: C.QUEUE_WORK,
        task: args.task,
        workRoom: args.workRoom,
        priority: args.priority,
        creeps: [],
        creepLimit: args.creepLimit,
    };

    if (args.targetId) {
        record.targetId = args.targetId;
    }

    if (args.message) {
        record.message = args.message;
    }

    if (args.spawnRoom) {
        record.spawnRoom = args.spawnRoom;
    }

    if (args.managed) {
        record.managed = args.managed;
    }

    logger.debug('adding record, task: ' + record.task + ', priority: ' + record.priority);

    return addQueue(record);
};

let workQueue = new WorkQueue();

global.addQueueWork = function(args) {
    return workQueue.addRecord(args);
};

global.getQueueWork = function() {
    return workQueue.getQueue();
};

global.isQueuedWork = function(args) {
    return workQueue.isQueued(args);
};
