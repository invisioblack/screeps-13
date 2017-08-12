/*
 * Link Managment
 *
 * link managment controls transfering energy between links
 *
 */

var Logger = require('util.logger');

var logger = new Logger('[Manage Link]');
logger.level = C.LOGLEVEL.DEBUG;

var Link = function() {
    // init
};

Link.prototype.doRoom = function(room) {
    let cpuStart = Game.cpu.getUsed();

    let log = { command: 'links', };

    let links = room.getLinks();

    if (links.length <= 0) {
        return true;
    }

    let linksStorage = _.filter(links, structure => structure.memory.type == 'storage');
    let linkStorage = false;

    if (linksStorage.length <= 0) {
        if (!room.storage) {
            return true;
        }

        linkStorage = Game.getObjectById(room.storage.getLinkAtRange(2));
    } else {
        linkStorage = linksStorage[0];
    }

    if (!linkStorage) {
        return true;
    }

    if (linksStorage.length > 1) {
        logger.warn('room: ' + room.name + ' has more then one storage link');
    }

    let linksIn = _.filter(links, structure => structure.memory.type == 'in');
    let linksOut = _.filter(links, structure => structure.memory.type == 'out');

    if (linksIn.length > 0) {
        for (let i = 0; i < linksIn.length; i++) {
            if (linksIn[i].energy > (linksIn[i].energyCapacity * C.ENERGY_LINK_IN_MIN) &&
                linksIn[i].cooldown == 0) {
                linksIn[i].transferEnergy(linkStorage);
            }
        }
    }

    if (linksOut.length > 0 && linkStorage.cooldown == 0 &&
        linkStorage.energy > (linkStorage.energyCapacity * C.LINK_STORAGE_TRANSFER_MIN) ) {
        for (let i = 0; i < linksOut.length; i++) {
            if (linksOut[i].energy < (linksOut[i].energyCapacity * C.ENERGY_LINK_OUT_MAX)) {
                linkStorage.transferEnergy(linksOut[i]);
                break;
            }
        }
    }

    log.status = 'OK';
    log.cpu = Game.cpu.getUsed() - cpuStart;

    Game.Visuals.addLog(room.name, log)
};

Link.prototype.setType = function(id, type) {
    if (!id) { return ERR_INVALID_ARGS; }
    if (!type) { return ERR_INVALID_ARGS; }

    let link = Game.getObjectById(id);
    if (!link) { return false; }

    link.memory.type = type;

    return true;
}


module.exports = Link;
