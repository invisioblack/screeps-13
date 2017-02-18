/*
 * Role Repairer
 *
 * repairer role handles structures with hit damage
 * downgrades to upgrader when no repair jobs are found
 *
 */
 
var roleUpgrader = require('role.upgrader');

var roleRepairer = {
    
    workTypes: [
        'repair',
        ],
    
    /** @param {Creep} creep **/
    run: function(creep) {
        
        if (creep.manageState()) {
            if (creep.memory.working) {
                creep.say('🔧');
            } else {
                creep.say('🔋');
            }
        }
        
        if (creep.memory.idleStart > (Game.time - Constant.CREEP_IDLE_TIME)) {
            creep.moveToIdlePosition();
            
            return false;
        }
        
        if (creep.memory.working) {
            this.doWork();
        } else {
            this.doRecharge();
        }
    },
    
    /** @param {Creep} creep **/
    doWork: function() {
        if (!creep.memory.workId) {
            if (!creep.getWork(this.workTypes)) {
                creep.memory.idleStart = Game.time;
                
                return false;
            }
        }
        
        if (!creep.doWork()) {
            if (Constant.DEBUG) {
                console.log("DEBUG - " + this.memory.role + " " + this.name + ' failed doWork');
            }
        }
        
        return true;
    },
    
    /** @param {Creep} creep **/
    doRecharge: function(creep) {
        if (!creep.memory.goingTo || creep.memory.goingTo == undefined) {
            if (!this.getRechargeLocation(creep)) {
                if (!creep.isCarryingEnergy()) {
                    creep.memory.idleStart = Game.time;
                } else {
                    creep.toggleState();
                }
                
                return false;
            }
        }
        
        let target = Game.getObjectById(creep.memory.goingTo);
        creep.withdrawEnergy(target);
        
        return true;
    },
    
    /** @param {Creep} creep **/
    getRechargeLocation: function(creep) {
        
        if (creep.getTargetContainerEnergy('withdraw', 'out')) {
            return true;
        }
        if (creep.getTargetContainerEnergy('withdraw')) {
            return true;
        }
        if (creep.room.controller.level <= Constant.CONTROLLER_WITHDRAW_LEVEL) {
            if (creep.getTargetExtentionEnergy('withdraw')) {
                return true;
            }
            if (creep.getTargetSpawnEnergy('withdraw')) {
                return true;
            }
        }
        
        return false;
    }
};

module.exports = roleRepairer;
