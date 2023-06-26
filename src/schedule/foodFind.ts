import schedule from "node-schedule";
import { findFood } from "../findFood/index.js";
import * as CONFIG from '../menu/config.js';
import { bot } from "../app.js";
import { getRandomIntInclusive } from "../utils/index.js";

const foodZavtrak = schedule.scheduleJob("0 0 8 * * *", function () {
    try {
        findFood('na-zavtrak')
    } catch (e) {
        console.error(e)
    }
});

const foodPoldnik = schedule.scheduleJob("0 0 10 * * *", function () {
    try {
        findFood('vjpechka')
    } catch (e) {
        console.error(e)
    }
});

const foodObed = schedule.scheduleJob("0 0 12 * * *", function () {
    try {
        findFood('supj')
    } catch (e) {
        console.error(e)
    }
});

const foodNational = schedule.scheduleJob("0 0 15 * * *", function () {
    try {
        let keys = Object.values(CONFIG.CATEGORY["Национальная кухня"])
        let random = getRandomIntInclusive(0, keys.length - 1)
        findFood(keys[random])
    } catch (e) {
        console.error(e)
    }
});

const foodUzin = schedule.scheduleJob("0 0 17 * * *", function () {
    try {
        findFood('vtoroe-bludo')
    } catch (e) {
        console.error(e)
    }
});


export default {foodZavtrak, foodObed, foodUzin, foodPoldnik}