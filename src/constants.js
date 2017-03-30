/*
 * Set variables for managment
 *
 * ACTIVE: controls run loop
 * DEBUG: Report on values at runtime
 *
 * ENERGY_* values set upper and lower usage values
 *
 * LIMIT_* values max creep spawn per room
 *
 */

var Constants = {

    // debug: 0 off, 1 info, 2 debug, 3 verbose
    DEBUG:                          2,
    SIM:                            false,
    VISUALS:                        true,

    ENERGY_ROOM_WITHDRAW_MIN:       200,
    ENERGY_CREEP_SPAWN_MIN:         200,
    ENERGY_TOWER_MIN:               300,
    ENERGY_CONTAINER_MAX_PERCENT:   0.9,
    ENERGY_CONTAINER_MIN_PERCENT:   0.1 ,
    ENERGY_CONTAINER_MIN_WITHDRAW:  100,
    ENERGY_STORAGE_MIN_WITHDRAW:    100,
    ENERGY_LINK_IN_MIN:             0.1,
    ENERGY_LINK_OUT_MAX:            0.8,
    ENERGY_LINK_STORAGE_MIN:        0.5,
    ENERGY_LINK_STORAGE_MAX:        0.75,

    CONTROLLER_WITHDRAW_LEVEL:      2,
    CONTROLLER_RESERVE_MAX:         4000,
    CONTROLLER_RESERVE_MIN:         1000,

    FIND_WAIT_TICKS:                8,
    MANAGE_WAIT_TICKS:              10,
    REPORT_TICKS:                   500,
    DEFENSE_COOLDOWN:               80,
    DEFENSE_LIMIT_INCREASE_DELAY:   100,

    SPAWN_COST_DECAY:               200,
    SPAWN_QUEUE_DELAY:              2,
    SPAWN_ENERGY_MAX:               0.8,

    REPAIR_HIT_WORK_MIN:            0.80,
    REPAIR_HIT_WORK_MAX:            0.98,
    RAMPART_HIT_MAX:                100000,
    WALL_HIT_MAX:                   100000,

    REFILL_TOWER_MAX:               0.98,
    REFILL_TOWER_MIN:               0.70,

    CREEP_DESPAWN_TICKS:            1,
    CREEP_IDLE_TIME:                4,
    CREEP_STUCK_TICK:               4,

    QUEUE_WORK:                     'work',
    QUEUE_SPAWN:                    'spawn',

    ROLE_TYPES: [
        'miner',
        'upgrader',
        'tech',
        'hauler',
        'resupply',
        'longhauler',
        'scout',
        'controller',
        'combat.brawler',
        ],

    WORK_TASKS: [
        'director.room',
        'director.remote',
        'director.mine',
        'director.tech',
        'director.haul',
        'director.resupply',
        'mine',
        'longhaul',
        'upgrade',
        'reserve',
        'tower.fill',
        'repair',
        'construction',
        'signcontroller',
        'scouting',
        'defense',
        'attack',
        'claim',
        ],

    DIRECTIONS: {
        1: [0, -1],
        2: [1, -1],
        3: [1, 0],
        4: [1, 1],
        5: [0, 1],
        6: [-1, 1],
        7: [-1, 0],
        8: [-1, -1],
    },

};

module.exports = Constants;