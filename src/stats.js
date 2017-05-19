/*
 * Stats systems
 *
 */

var Stats =  function() {
    Memory.stats = Memory.stats || {};
    this.memory = Memory.stats;
    this.memory.cpugraphdata = this.memory.cpugraphdata || [];
    this.memory.rooms = this.memory.rooms || {};
};

Stats.prototype.run = function() {
    this.logEnergy();
    this.logCPU();

    this.visuals();
};

Stats.prototype.logEnergy = function() {
    for (let name in Game.rooms) {
        if (!Game.rooms[name] || !Game.rooms[name].controller) { continue; }
        if (Game.rooms[name] && Game.rooms[name].controller.my) {
            // spawn energy
            this.memory.rooms[name] = this.memory.rooms[name] || {};
            this.memory.rooms[name].energy = this.memory.rooms[name].energy || [];
            this.memory.rooms[name].energyChange = this.memory.rooms[name].energyChange || [];
            this.memory.rooms[name].storage = this.memory.rooms[name].storage || [];
            if (Game.rooms[name].energyAvailable) {
                this.memory.rooms[name].energy.push(Game.rooms[name].energyAvailable);
            } else {
                this.memory.rooms[name].energy.push(0);
            }

            // storage
            if (Game.rooms[name].storage) {
                this.memory.rooms[name].storage.push(_.sum(Game.rooms[name].storage.store));
            } else {
                this.memory.rooms[name].storage.push(0);
            }

            // energy change
            let energy = 0;
            if (Game.rooms[name].storage) {
                energy += Game.rooms[name].storage.store[RESOURCE_ENERGY];
            }
            if (Game.rooms[name].energyAvailable) {
                energy += Game.rooms[name].energyAvailable;
            }
            LastTickEnergy = this.memory.rooms[name].lastTickEnergy;
            this.memory.rooms[name].lastTickEnergy = energy;
            let change = (energy - LastTickEnergy) / LastTickEnergy;
            if (change != 0) {
                this.memory.rooms[name].energyChange.push(change);
            }

            // length
            if ( this.memory.rooms[name].energy.length > 100 ) { this.memory.rooms[name].energy.shift(); }
            if ( this.memory.rooms[name].energyChange.length > 40 ) { this.memory.rooms[name].energyChange.shift(); }
            if ( this.memory.rooms[name].storage.length > 100 ) { this.memory.rooms[name].storage.shift(); }
        } else {
            if (this.memory.rooms[name]) {
                delete this.memory.rooms[name];
            }
        }
    }
};

Stats.prototype.logCPU = function() {
    this.memory.cpugraphdata.push(Game.cpu.getUsed());
    if ( this.memory.cpugraphdata.length > 100 ) { this.memory.cpugraphdata.shift(); }
};

Stats.prototype.visuals = function() {
    if (!C.VISUALS) { return true; }

    this.graphCPU();
    //this.graphEnergyChange();
    //this.reportEnergy();
    this.reportWork();
};

Stats.prototype.reportEnergy = function() {
    let size = {t: 2, l: 48, gh: 0.6, gw: 2.6 };
    let fontSize = 0.5;
    let textStyle = {
        align: 'right',
        color: '#BBBBBB',
        font: fontSize,
        opacity: 0.8,
        background: '#222222',
        stroke : '#222222',
        strokeWidth : 0.15,
    };
    let rv = new RoomVisual();

    rv.text('Energy Report', size.l, size.t - 0.5, textStyle);
    let count = 0;
    for (let name in this.memory.rooms) {
        if (!Game.rooms[name] || !Game.rooms[name].controller) { continue; }
        if (!Game.rooms[name].controller.my) {
            delete this.memory.rooms[name];
            continue;
        }
        rv.text(name, size.l - 1 - (size.gw * 2), size.t + 0.5 + ((0.5 + size.gh) * count), textStyle);
        rv.rect(
            size.l - size.gw,
            size.t + ((0.5 + size.gh) * count),
            size.gw,
            size.gh,
            { fill: 'transparent', stroke: '#8a8a8a', opacity: 0.3, }
        );
        rv.rect(
            size.l - size.gw + 0.05,
            size.t + 0.05 + ((0.5 + size.gh) * count),
            (((size.gw - 0.1) / 1000000) * this.memory.rooms[name].storage[this.memory.rooms[name].storage.length - 1]),
            size.gh - 0.1,
            { fill: '#ffff00', opacity: 0.3, }
        );
        rv.text(
            this.memory.rooms[name].storage[this.memory.rooms[name].storage.length - 1],
            size.l - (3 * (size.gw / 4)),
            size.t + ((size.gh + 0.25) * 0.5) + ((0.5 + size.gh) * count),
            { align: 'left', color: '#7fff00', font: 0.4, opacity: 0.6, stroke : '#222222', strokeWidth : 0.15, }
        );

        rv.rect(size.l - 0.5 - (size.gw * 2), size.t + ((0.5 + size.gh) * count), size.gw, size.gh, { fill: 'transparent', stroke: '#8a8a8a', opacity: 0.3, });
        let energyMax = Math.floor(Math.max.apply(null, this.memory.rooms[name].energy) + 2);
        let energyMin = Math.floor(Math.min.apply(null, this.memory.rooms[name].energy) - 2);
        let roomMax = Game.rooms[name].energyCapacityAvailable;
        roomMax = roomMax || 100;
        let average = _.sum(this.memory.rooms[name].energy) / (this.memory.rooms[name].energy.length + 1);
        energyMin = energyMin < 0 ? 0 : energyMin;

        // average block
        /*
        rv.rect(
            size.l - 0.5 - (size.gw * 2),
            size.t + ((0.5 + size.gh) * count),
            size.gw,
            size.gh,
            { fill: 'transparent', stroke: '#8a8a8a', opacity: 0.3, }
        );
        */
        // average line
        rv.line(
            size.l - 0.5 - (size.gw * 2) + ((size.gw / roomMax) * average),
            size.t + 0.05 + (size.gh / 2) + ((0.5 + size.gh) * count),
            size.l - 0.5 - (size.gw * 2) + ((size.gw / roomMax) * average),
            size.t + size.gh - 0.05 + ((0.5 + size.gh) * count),
            { color: '#ff7f00', opacity: 0.3, }
        );
        // line between min and max
        rv.line(
            size.l - 0.5 - (size.gw * 2) + ((size.gw / roomMax) * energyMin),
            size.t + (size.gh / 2) + ((0.5 + size.gh) * count),
            size.l - 0.5 - (size.gw * 2) + ((size.gw / roomMax) * energyMax),
            size.t + (size.gh / 2) + ((0.5 + size.gh) * count),
            { color: '#8a8a8a', opacity: 0.3, }
        );
        // min energy dot
        rv.circle(
            size.l - 0.5 - (size.gw * 2) + ((size.gw / roomMax) * energyMin),
            size.t + (size.gh / 2) + ((0.5 + (size.gh)) * count),
            { radius: 0.1, fill: '#ff0000', opacity : 0.5 }
        );
        // max energy bot
        rv.circle(
            size.l - 0.5 - (size.gw * 2) + ((size.gw / roomMax) * energyMax),
            size.t + (size.gh / 2) + ((0.5 + (size.gh)) * count),
            { radius: 0.1, fill: '#7fff00', opacity : 0.5 }
        );
        // current Energy
        rv.line(
            size.l - 0.5 - (size.gw * 2) + ((size.gw / roomMax) * this.memory.rooms[name].energy[this.memory.rooms[name].energy.length - 1]),
            size.t + 0.05 + ((0.5 + size.gh) * count),
            size.l - 0.5 - (size.gw * 2) + ((size.gw / roomMax) * this.memory.rooms[name].energy[this.memory.rooms[name].energy.length - 1]),
            size.t + (size.gh / 2) - 0.05 + ((0.5 + size.gh) * count),
            { color: '#7fff00', opacity: 0.6, }
        );

        count++;
    }
};

Stats.prototype.reportWork = function() {
    let size = {t: 2, l: 1, };
    let fontSize = 0.45;
    let lineSpace = 0.08;
    let textStyle = {
        align: 'left',
        color: '#BBBBBB',
        font: fontSize,
        opacity: 0.6,
        background: '#222222',
        stroke : '#222222',
        strokeWidth : 0.15,
	};

    for (let roomName in Game.rooms) {
        let output = 'Work Report for ' + roomName + '\n';
        output += Game.Queue.getRoomReport(roomName);
        let rv = new RoomVisual(roomName);
        let lines = output.split('\n');
        for (let l = 0; l < lines.length; l++) {
            rv.text(lines[l], size.l, size.t + (l * (fontSize + lineSpace)), textStyle);
        }
    }

};

Stats.prototype.graphEnergyChange = function() {
    let size = {w: 12, h: 3, t: 45, l: 35, };

    for (let roomName in Game.rooms) {
        if (!this.memory.rooms[roomName] || !this.memory.rooms[roomName].energyChange) {
            continue;
        }
        let energyChange = this.memory.rooms[roomName].energyChange;
        let energyMax = Math.max.apply(null, energyChange) + 0.001;
        let energyMin = Math.min.apply(null, energyChange) - 0.001;
        let step = (energyMax - energyMin) / 4;
        let rv = new RoomVisual(roomName);
        let recCount =  energyChange.length - 1;

        rv.rect(size.l - 0.1, size.t - 0.1, size.w + 0.2, size.h + 0.2, { fill: 'transparent', stroke: '#8a8a8a', opacity: 0.3, });
        rv.line(size.l, size.t + (size.h * 0.25), size.l + size.w, size.t + (size.h * 0.25), { color: '#8a8a8a', opacity: 0.3, lineStyle: 'dashed', });
        rv.line(size.l, size.t + (size.h * 0.50), size.l + size.w, size.t + (size.h * 0.50), { color: '#8a8a8a', opacity: 0.3, lineStyle: 'dashed', });
        rv.line(size.l, size.t + (size.h * 0.75), size.l + size.w, size.t + (size.h * 0.75), { color: '#8a8a8a', opacity: 0.3, lineStyle: 'dashed', });
        rv.text("Energy Change Graph", size.l, size.t - 0.5, {color: "#BBBBBB", align: "left", size: 0.45, stroke : '#222222', strokeWidth : 0.15, background: "222222" });
        rv.text((energyMax).toFixed(3), size.l - 0.3, size.t + 0.2, {color: this.getEnergyGraphColor(energyMax), align: "right", size: 0.45, stroke : '#222222', strokeWidth : 0.15, background: "222222" });
        rv.text((energyMin + (step * 3)).toFixed(3), size.l - 0.3, size.t + (size.h - (size.h * 0.75)) + 0.2, {color: this.getEnergyGraphColor(energyMin + (step * 3)), align: "right", size: 0.45, stroke : '#222222', strokeWidth : 0.15, background: "222222" });
        rv.text((energyMin + (step * 2)).toFixed(3), size.l - 0.3,  size.t + (size.h - (size.h * 0.5)) + 0.2, {color: this.getEnergyGraphColor(energyMin + (step * 2)), align: "right", size: 0.45, stroke : '#222222', strokeWidth : 0.15, background: "222222" });
        rv.text((energyMin + (step * 1)).toFixed(3), size.l - 0.3,  size.t + (size.h - (size.h * 0.25)) + 0.2, {color: this.getEnergyGraphColor(energyMin + (step * 1)), align: "right", size: 0.45, stroke : '#222222', strokeWidth : 0.15, background: "222222" });
        rv.text((energyMin).toFixed(3), size.l - 0.3,  size.t + size.h + 0.2, {color: this.getEnergyGraphColor(energyMin), align: "right", size: 0.45, stroke : '#222222', strokeWidth : 0.15, background: "222222" });

        for ( let i = 0; i < energyChange.length; i ++ ) {
            let energyUsed = energyChange[i];
            let energyUsedLast = energyChange[i-1];

            if ( i > 0 ) {
                rv.line(
                    size.l + ((size.w / recCount) * i),
                    size.t + ((size.h / (energyMax - energyMin)) * (energyMax - energyUsed)),
                    size.l + ((size.w / recCount) * (i - 1)),
                    size.t + ((size.h / (energyMax - energyMin)) * (energyMax - energyUsedLast)),
                    { color: '#9c9c9c' }
                );
            }
            rv.circle(
                size.l + ((size.w / recCount) * i),
                size.t + ((size.h / (energyMax - energyMin)) * (energyMax - energyUsed)),
                { radius: 0.1, fill: this.getEnergyGraphColor(energyUsed), opacity : 0.5 }
            );
        }
    }
};

Stats.prototype.graphCPU = function() {
    let cpuMax = Math.floor(Math.max.apply(null, this.memory.cpugraphdata) + 2);
    let cpuMin = Math.floor(Math.min.apply(null, this.memory.cpugraphdata) - 2);
    cpuMin = cpuMin < 0 ? 0 : cpuMin;
    let step = Math.floor((cpuMax - cpuMin) / 4);
    let size = {w: 18, h: 4, t: 44, l: 2, };
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
                size.l + ((size.w / 99) * i),
                size.t + ((size.h / (cpuMax - cpuMin)) * (cpuMax - cpuUsed)),
                size.l + ((size.w / 99) * (i - 1)),
                size.t + ((size.h / (cpuMax - cpuMin)) * (cpuMax - cpuUsedLast)),
                { color: '#9c9c9c' }
            );
        }
        rv.circle(
            size.l + ((size.w / 99) * i),
            size.t + ((size.h / (cpuMax - cpuMin)) * (cpuMax - cpuUsed)),
            { radius: 0.1, fill: this.getCpuGraphColor(cpuUsed), opacity : 0.5 }
        );
    }
};

Stats.prototype.getCpuGraphColor = function(num) {
    let color = "#6a6aff";
    color = num > (Game.cpu.limit * 0.35) ? '#7fff00' : color;
    color = num > (Game.cpu.limit * 0.6) ? '#ffff00' : color;
    color = num > (Game.cpu.limit * 0.8) ? '#ff7f00' : color;
    color = num > (Game.cpu.limit * 0.95) ? '#ff0000' : color;
    return color;
};

Stats.prototype.getEnergyGraphColor = function(num) {
    let color = "#99ff66";
    color = num > 0.3 ? '#33cc33' : color;
    color = num > 0.8 ? '#006600' : color;

    color = num < 0 ? '#ffff00' : color;
    color = num < -0.2 ? '#ff9900' : color;
    color = num < -0.6 ? '#ff6600' : color;
    color = num < -0.9 ? '#cc0000' : color;
    return color;
};

module.exports = Stats
