/*
 * role Combat Tank
 *
 * combat tank role defines a combat creep that can tank towers from range
 * designed to drain energy from a room
 *
 */

var roleCombatTank = {

    /**
    * The role name
    **/
    role: C.COMBAT_TANK,

    /**
    * @param {Creep} creep
    **/
    doRole: function(creep) {
        if (!creep) { return false; }

        if (creep.getOffExit()) { return true; }
        if ((creep.memory.idleStart + C.CREEP_IDLE_TIME) > Game.time) {
            creep.moveToIdlePosition();
            return true;
        }

        let workTasks = [ C.TANK, ];

        if (!creep.memory.workId) {
            if (!creep.getWork(workTasks, {ignoreRoom: true})) {
                creep.memory.idleStart = Game.time;
                creep.say('💤');
                return true;
            } else {
                creep.say('🔰');
            }
        }

        if (!creep.doWork()) {
            if (C.DEBUG >= 2) { console.log('DEBUG - do work failed for role: ' + creep.memory.role + ', name: ' + creep.name); }
        }

        return true;
    },

    /**
    * Create the body of the creep for the role
    * @param {number} energy The amount of energy avalible
    * @param {Object} args Extra arguments
    **/
    getBody: function(energy, args) {
        if (isNaN(energy)) { return ERR_INVALID_ARGS; }
        args = args || {};

        let healUnits = Math.floor((energy * 0.6) / 275);
        healUnits = healUnits < 1 ? 1 : healUnits;
        healUnits = healUnits > 30 ? 30 : healUnits;
        energy -= (healUnits * 275);

        let moveUnits = Math.ceil(healUnits / 2);

        let toughUnits = 0;
        if ((moveUnits + healUnits) < 50) {
            let maxTough = Math.floor((moveUnits + healUnits);

            toughUnits = Math.floor(energy / 60);
            toughUnits = toughUnits > maxTough / 2) ? maxTough : toughUnits;
            moveUnits += toughUnits;
        }

        let body = [];
        for (let i = 0; i < toughUnits; i++) {
            body.push(TOUGH);
        }
        for (let i = 0; i < healUnits; i++) {
            body.push(HEAL);
        }
        for (let i = 0; i < moveUnits; i++) {
            body.push(MOVE);
        }

        return body;
    },

    /**
    * Spawn the creep
    * @param {Spawn} spawn The spawn to be used
    * @param {array} body The creep body
    * @param {Object} args Extra arguments
    **/
    doSpawn: function(spawn, body, args) {
        if (!spawn) { return ERR_INVALID_ARGS; }
        if (!Array.isArray(body) || body.length < 1) { return ERR_INVALID_ARGS; }
        args = args || {};
        args.role = args.role || this.role;
        let name = Game.Queue.spawn.getCreepName(this.role);

        return spawn.createCreep(body, name, args);
    },

};

module.exports = roleCombatTank;
