import schedule from "node-schedule";
import { findFood } from "../findFood/index.js";
import { bot } from "../app.js";

const foodFinder = schedule.scheduleJob("* * * * * *", function () {
    try {
        findFood('supj')
    } catch (e) {
        console.error(e)
    }
});

export default foodFinder