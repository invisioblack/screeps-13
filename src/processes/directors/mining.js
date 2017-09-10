/*
 * Director Mining
 *
 * runs processes to manage mining in the room
 *
 */

var logger = new Logger('[Mining Director]');
logger.level = C.LOGLEVEL.DEBUG;

var directorMining = function() {
    // init
}

Object.defineProperty(directorMining.prototype, 'processTable', {
    get: function() {
        this.memory.processTable = this.memory.processTable || {};
        return this.memory.processTable;
    },
    set: function(value) {
        this.memory.processTable = this.memory.processTable || {};
        this.memory.processTable = value;
    },
});

directorMining.prototype.run = function() {
    let room = Game.rooms[this.memory.workRoom];

    if (!room) {
        return false;
    }

    if (!this.memory.sourceInit) {
        if (this.getSources()) {
            this.memory.sourceInit = 1;
        }
    }

    for (let i = 0; i < this.memory.sources.length; i++) {
        let source = this.memory.sources[i];

        if (!source.pid || !Game.kernel.getProcessByPid(source.pid)) {
            let p = Game.kernel.startProcess(this, C.DIRECTOR_SOURCE, {
                workRoom: this.memory.workRoom,
                spawnRoom: this.memory.spawnRoom,
                sourceId: source.id,
            });

            source.pid = p.pid;
        }
    }

    Game.kernel.sleepProcess(this.pid, (C.DIRECTOR_SLEEP + Math.floor(Math.random() * 8)));

    return true;
};

directorMining.prototype.getSources = function() {
    this.memory.sources = this.memory.sources || [];

    let room = Game.rooms[this.memory.workRoom];

    if (!room) {
        return false;
    }

    let sources = room.getSources();

    if (sources.length <= 0) {
        return true;
    }

    for (let i = 0; i < sources.length; i++) {
        let source = {
            id: sources[i].id,
            pid: undefined,
        };

        this.memory.sources.push(source);
    }

    return true;
};

registerProcess(C.DIRECTOR_MINING, directorMining);
