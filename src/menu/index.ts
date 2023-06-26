import { bot } from "../app.js";
import { Markup, Telegraf } from 'telegraf'
import { CATEGORY } from "./config.js";
import { getFoodByCode, getFoodByCodeFromUser, getFullFoodRecept } from "../findFood/index.js";
import { getFullReceptiesForSite } from "../findFood/findFood.js";
import { getRandomIntInclusive } from "../utils/index.js";

const locker = new Set()

export function loadMenu() {
    bot.bot.command('categories', (ctx) => {
        if (locker.has(ctx.update.message.from.id)) return;
        ctx.reply("Выберите категорию", Markup.inlineKeyboard([
            [Markup.button.callback("По времени суток", "po_vremeni_sutok")],
            [Markup.button.callback("Сладкое", "sladkoe")],
            [Markup.button.callback("Национальная кухня", "nacional_kuxnya")],
            [Markup.button.callback("Напитки", "napitki")],
            [Markup.button.callback("Гарниры", "garnirj")],
            [Markup.button.callback("Закуски", "zakuski")],
            [Markup.button.callback("Быстро и вкусно", "bjstro-i-vkusno")],
            [Markup.button.callback("Крупа", "krupa-i-krupyanje-izdeliya")],
        ]))
    })

    bot.bot.action("po_vremeni_sutok", async (ctx) => {
        ctx.reply("Выберите категорию", Markup.inlineKeyboard(Object.entries(CATEGORY['По времени суток']).map(([key, value]) => {
            return [Markup.button.callback(key, value)]
        }),))
    })

    bot.bot.action("sladkoe", async (ctx) => {
        ctx.reply("Выберите категорию", Markup.inlineKeyboard(Object.entries(CATEGORY['Сладкое']).map(([key, value]) => {
            return [Markup.button.callback(key, value)]
        })))
    })

    bot.bot.action("nacional_kuxnya", async (ctx) => {
        ctx.reply("Выберите категорию", Markup.inlineKeyboard(Object.entries(CATEGORY['Национальная кухня']).map(([key, value]) => {
            return [Markup.button.callback(key, value)]
        })))
    })

    bot.bot.action("napitki", async (ctx) => {
        if (locker.has(ctx.update.callback_query.from.id)) return;
        locker.add(ctx.update.callback_query.from.id)
        await getFullFoodRecept(ctx, "napitki")
        locker.delete(ctx.update.callback_query.from.id)
    })
    bot.bot.action("garnirj", async (ctx) => {
        if (locker.has(ctx.update.callback_query.from.id)) return;
        locker.add(ctx.update.callback_query.from.id)
        await getFullFoodRecept(ctx, "garnirj")
        locker.delete(ctx.update.callback_query.from.id)
    })
    bot.bot.action("zakuski", async (ctx) => {
        if (locker.has(ctx.update.callback_query.from.id)) return;
        locker.add(ctx.update.callback_query.from.id)
        await getFullFoodRecept(ctx, "zakuski")
        locker.delete(ctx.update.callback_query.from.id)
    })
    bot.bot.action("bjstro-i-vkusno", async (ctx) => {
        if (locker.has(ctx.update.callback_query.from.id)) return;
        locker.add(ctx.update.callback_query.from.id)
        await getFullFoodRecept(ctx, "bjstro-i-vkusno")
        locker.delete(ctx.update.callback_query.from.id)
    })
    bot.bot.action("krupa-i-krupyanje-izdeliya", async (ctx) => {
        if (locker.has(ctx.update.callback_query.from.id)) return;
        locker.add(ctx.update.callback_query.from.id)
        await getFullFoodRecept(ctx, "krupa-i-krupyanje-izdeliya")
        locker.delete(ctx.update.callback_query.from.id)
    })

    Object.entries(CATEGORY['По времени суток']).forEach(([key, value]) => {
        bot.bot.action(value, async (ctx) => {
            if (locker.has(ctx.update.callback_query.from.id)) return;
            locker.add(ctx.update.callback_query.from.id)
            await getFullFoodRecept(ctx, value)
            locker.delete(ctx.update.callback_query.from.id)
        })
    })

    Object.entries(CATEGORY['Сладкое']).forEach(([key, value]) => {
        bot.bot.action(value, async (ctx) => {
            if (locker.has(ctx.update.callback_query.from.id)) return;
            locker.add(ctx.update.callback_query.from.id)
            await getFullFoodRecept(ctx, value)
            locker.delete(ctx.update.callback_query.from.id)
        })
    })

    Object.entries(CATEGORY['Национальная кухня']).forEach(([key, value]) => {
        bot.bot.action(value, async (ctx) => {
            if (locker.has(ctx.update.callback_query.from.id)) return;
            locker.add(ctx.update.callback_query.from.id)
            await getFullFoodRecept(ctx, value)
            locker.delete(ctx.update.callback_query.from.id)
        })
    })

    bot.bot.on('callback_query', async function (msg) {
        if (msg.update.callback_query.data.indexOf('getReceptCode') == -1) return;
        let [event, _code] = msg.update.callback_query.data.split('_');
        let code = parseInt(_code)
        if (!code || isNaN(code)) return console.log('Ошибка!')
        locker.add(msg.from.id)
        await getFoodByCodeFromUser(msg.from.id, code)
        locker.delete(msg.from.id)
    });


    bot.bot.command('random', (ctx) => {
        if (locker.has(ctx.update.message.from.id)) return;
        let allSrc = []
        Object.values(CATEGORY).forEach(e => {
            if (typeof(e) != 'string') return Object.values(e).forEach(el => allSrc.push(el))
            else return allSrc.push(e)
        })
      let random = getRandomIntInclusive(0, allSrc.length - 1)
      getFullFoodRecept(ctx, allSrc[random])
    })
}

