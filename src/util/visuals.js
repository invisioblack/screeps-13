/*
 * Visuals systems
 *
 */

var Visuals = function() {
    Memory.stats = Memory.stats || {};
    this.memory = Memory.stats;
    this.memory.cpugraphdata = this.memory.cpugraphdata || [];

    this.roomLogs = {};
    this.globalLogs = [];
};

Visuals.prototype.run = function() {
    this.logCPU();
    this.visuals();
};

Visuals.prototype.addLog = function(roomName, result) {
    if (roomName) {
        if (!this.roomLogs[roomName]) {
            this.roomLogs[roomName] = [];
        }

        this.roomLogs[roomName].push(result);
    } else {
        this.globalLogs.push(result);
    }
};

Visuals.prototype.printLogs = function() {
    let size = {t: 2, l: 1, };
    let fontSize = 0.5;
    let lineSpace = 0.1;
    let textStyle = {
        align: 'left',
        color: '#51d181',
        font: fontSize,
        opacity: 0.6,
        background: '#222222',
        stroke : '#072812',
        strokeWidth : 0.15,
	};


    var gOutput = 'Terminal Link JENOVA HEAVY INDUSTRIES\n\n' +
        'Executing Global Processes\n';

    for (let i = 0; i < this.globalLogs.length; i++) {
        let logEntry = this.globalLogs[i];

        gOutput += ' * ' + logEntry.command +
            ' [ CPU ' + logEntry.cpu.toFixed(2) + ' ]' +
            '... ' + logEntry.status + '\n';

        if (logEntry.output) {
            gOutput += '    - ' + logEntry.output + '\n';
        }
    }

    for (let roomName in this.roomLogs) {
        let logs = this.roomLogs[roomName];

        let rv = new RoomVisual(roomName);

        let output = gOutput + '\nExecuting Room Processes\n';

        for (let i = 0; i < logs.length; i++) {
            let logEntry = logs[i];

            output += ' * ' + logEntry.command +
                ' [ CPU ' + logEntry.cpu.toFixed(2) + ' ]' +
                '... ' + logEntry.status + '\n';

            if (logEntry.output) {
                output += '    - ' + logEntry.output + '\n';
            }
        }

        let lines = output.split('\n');

        for (let l = 0; l < lines.length; l++) {
            rv.text(lines[l], size.l, size.t + (l * (fontSize + lineSpace)), textStyle);
        }
    }

};

Visuals.prototype.addDefense = function(roomName, args) {
    let rv = new RoomVisual(roomName);

    let size = {t: 4, l: 25, };
    let fontSize = 0.8;
    let lineSpace = 0.2;
    let textStyle = {
        align: 'center',
        color: '#51d181',
        font: fontSize,
        opacity: 0.6,
        background: '#222222',
        stroke : '#072812',
        strokeWidth : 0.15,
    };

    let output = '** Defense Mode Active **\n' +
        'Run Time: ' + args.ticks + ' ticks\n';

    if (args.cooldown) {
        output += 'On Cooldown: ' + args.cooldown;
    }

    let lines = output.split('\n');

    for (let l = 0; l < lines.length; l++) {
        rv.text(lines[l], size.l, size.t + (l * (fontSize + lineSpace)), textStyle);
    }
};

Visuals.prototype.logCPU = function() {
    this.memory.cpugraphdata.push(Game.cpu.getUsed());

    if ( this.memory.cpugraphdata.length > 50 ) {
        this.memory.cpugraphdata.shift();
    }
};

Visuals.prototype.visuals = function() {
    if (!C.VISUALS) {
        return true;
    }

    this.graphCPU();
    this.printLogs();
};

Visuals.prototype.graphCPU = function() {
    let cpuMax = Math.floor(Math.max.apply(null, this.memory.cpugraphdata) + 2);
    let cpuMin = Math.floor(Math.min.apply(null, this.memory.cpugraphdata) - 2);
    cpuMin = cpuMin < 0 ? 0 : cpuMin;
    let step = Math.floor((cpuMax - cpuMin) / 4);
    let size = {w: 12, h: 3, t: 44, l: 2, };
    let rv = new RoomVisual();

    rv.rect(size.l - 0.1, size.t - 0.1, size.w + 0.2, size.h + 0.2, { fill: 'transparent', stroke: '#8a8a8a', opacity: 0.3, });
    rv.line(size.l, size.t + (size.h * 0.25), size.l + size.w, size.t + (size.h * 0.25), { color: '#8a8a8a', opacity: 0.3, lineStyle: 'dashed', });
    rv.line(size.l, size.t + (size.h * 0.50), size.l + size.w, size.t + (size.h * 0.50), { color: '#8a8a8a', opacity: 0.3, lineStyle: 'dashed', });
    rv.line(size.l, size.t + (size.h * 0.75), size.l + size.w, size.t + (size.h * 0.75), { color: '#8a8a8a', opacity: 0.3, lineStyle: 'dashed', });
    rv.text("CPU Used Graph - Bucket " + Game.cpu.bucket, size.l, size.t - 0.5, {color: "#BBBBBB", align: "left", size: 0.45, stroke : '#222222', strokeWidth : 0.15, background: "222222" });
    rv.text(cpuMax, size.l - 0.3, size.t + 0.2, {color: this.getCpuGraphColor(cpuMax), align: "right", size: 0.45, stroke : '#222222', strokeWidth : 0.15, background: "222222" });
    rv.text(cpuMin + (step * 3), size.l - 0.3, size.t + (size.h - (size.h * 0.75)) + 0.2, {color: this.getCpuGraphColor(cpuMin + (step * 3)), align: "right", size: 0.45, stroke : '#222222', strokeWidth : 0.15, background: "222222" });
    rv.text(cpuMin + (step * 2), size.l - 0.3,  size.t + (size.h - (size.h * 0.5)) + 0.2, {color: this.getCpuGraphColor(cpuMin + (step * 2)), align: "right", size: 0.45, stroke : '#222222', strokeWidth : 0.15, background: "222222" });
    rv.text(cpuMin + (step * 1), size.l - 0.3,  size.t + (size.h - (size.h * 0.25)) + 0.2, {color: this.getCpuGraphColor(cpuMin + (step * 1)), align: "right", size: 0.45, stroke : '#222222', strokeWidth : 0.15, background: "222222" });
    rv.text(cpuMin, size.l - 0.3,  size.t + size.h + 0.2, {color: this.getCpuGraphColor(cpuMin), align: "right", size: 0.45, stroke : '#222222', strokeWidth : 0.15, background: "222222" });

    for ( let i = 0; i < this.memory.cpugraphdata.length; i ++ ) {
        let cpuUsed = this.memory.cpugraphdata[i];
        let cpuUsedLast = this.memory.cpugraphdata[i-1];

        if ( i > 0 ) {
            rv.line(
                size.l + ((size.w / 49) * i),
                size.t + ((size.h / (cpuMax - cpuMin)) * (cpuMax - cpuUsed)),
                size.l + ((size.w / 49) * (i - 1)),
                size.t + ((size.h / (cpuMax - cpuMin)) * (cpuMax - cpuUsedLast)),
                { color: '#9c9c9c' }
            );
        }
        rv.circle(
            size.l + ((size.w / 49) * i),
            size.t + ((size.h / (cpuMax - cpuMin)) * (cpuMax - cpuUsed)),
            { radius: 0.1, fill: this.getCpuGraphColor(cpuUsed), opacity : 0.5 }
        );
    }
};

Visuals.prototype.getCpuGraphColor = function(num) {
    let color = "#6a6aff";
    color = num > (Game.cpu.limit * 0.35) ? '#7fff00' : color;
    color = num > (Game.cpu.limit * 0.6) ? '#ffff00' : color;
    color = num > (Game.cpu.limit * 0.8) ? '#ff7f00' : color;
    color = num > (Game.cpu.limit * 0.95) ? '#ff0000' : color;
    return color;
};

module.exports = Visuals;