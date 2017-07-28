/*
 * task Militia
 *
 * task Militia defends rooms
 *
 */

var taskMilitia = {

    /**
    * @param {Creep} creep The creep object
    * @param {Task} task The work task passed from the work Queue
    **/
    run: function(creep) {
        if (!creep) { return ERR_INVALID_ARGS; }

        if (!creep.hasWork()) {
            let workTasks = [
                C.DEFENSE,
            ];

            if (!creep.getWork(workTasks)) {
                creep.sleep();
                creep.say('💤');

                return true;
            }
        }

        creep.doWork();

        return true;
    },

};

module.exports = taskMilitia;
