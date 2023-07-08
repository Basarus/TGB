import { bot } from "../app.js";
import { encodindString, getHiddenLink } from "../utils/index.js";
import { getReceptiesForSite, findFoodById, getFullRecept, getFullReceptiesForSite } from "./findFood.js";
import { Markup, Telegraf } from 'telegraf'

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function findFood(type, count = 0) {
    if (count > 3) return;
    const receptie = await getReceptiesForSite(type);
    if (receptie?.code == undefined) return findFood(type, count + 1)
    let text = `Полный рецепт (а так же многие другие) доступен по коду ${receptie.code} \n у бота @food1over_bot`
    await bot?.bot.telegram?.sendMessage('@my_world_foodlover',
        `${receptie.name}\n\nНутриенты и энергетическая ценность состава рецепта:\n- Калорий: ${receptie.colories.colories} ккал\n- Углеводы: ${receptie.colories.ugl} г\n- Белки: ${receptie.colories.belk} г\n- Жиры:  ${receptie.colories.fate} г\n\n⏲️ ${receptie.time}\n\nИнгредиенты:\n${receptie.ingredients.join('\n')}\n\n${text}\n
        ${getHiddenLink(receptie.resultphoto, "HTML")}
        `,
        {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Получить полный рецепт', callback_data: `getReceptCode_${receptie.code}` }],
                ]
            }
        }
    )
}

export async function getFoodByCode(ctx, code) {
    let receptie = await findFoodById(code);
    if (receptie == null) return ctx.sendMessage('Ошибка!\nБлюдо не найдено');
    await ctx.sendMessage(
        `${receptie.name}\n\nНутриенты и энергетическая ценность состава рецепта:\n- Калорий: ${receptie.colories.colories} ккал\n- Углеводы: ${receptie.colories.ugl} г\n- Белки: ${receptie.colories.belk} г\n- Жиры:  ${receptie.colories.fate} г\n\n⏲️ ${receptie.time}\n\nИнгредиенты:\n${receptie.ingredients.join('\n')}\n
        ${getHiddenLink(receptie.resultphoto, "HTML")}\n
        `,
        {
            parse_mode: "HTML",
        }
    )
    await sleep(100)
    for (let instruction of receptie.instruction) {
        await sleep(200)
        if (instruction.indexOf('img') != -1) await ctx.sendPhoto(instruction)
        else await ctx.sendMessage(instruction)
    }
}

export async function getFoodByCodeFromUser(id, code) {
    let receptie = await findFoodById(code);
    if (receptie == null) return;
    await bot.bot.telegram.sendMessage(id,
        `${receptie.name}\n\nНутриенты и энергетическая ценность состава рецепта:\n- Калорий: ${receptie.colories.colories} ккал\n- Углеводы: ${receptie.colories.ugl} г\n- Белки: ${receptie.colories.belk} г\n- Жиры:  ${receptie.colories.fate} г\n\n⏲️ ${receptie.time}\n\nИнгредиенты:\n${receptie.ingredients.join('\n')}\n
        ${getHiddenLink(receptie.resultphoto, "HTML")}\n
        `,
        {
            parse_mode: "HTML",
        }
    )
    await sleep(100)
    for (let instruction of receptie.instruction) {
        await sleep(200)
        if (instruction.indexOf('img') != -1) await bot.bot.telegram.sendPhoto(id, instruction)
        else await bot.bot.telegram.sendMessage(id, instruction)
    }
}

export async function getFullFoodRecept(ctx, type, count = 0) {
    if (count >= 3) return await ctx.sendMessage('К сожалению блюдо не найдено. Попробуйте позже!')
    let receptie = await getFullReceptiesForSite(type);
    if (receptie == null) return await getFullFoodRecept(ctx, type, count + 1);
    await ctx.sendMessage(
        `${receptie.name}\n\nНутриенты и энергетическая ценность состава рецепта:\n- Калорий: ${receptie.colories.colories} ккал\n- Углеводы: ${receptie.colories.ugl} г\n- Белки: ${receptie.colories.belk} г\n- Жиры:  ${receptie.colories.fate} г\n\n⏲️ ${receptie.time}\n\nИнгредиенты:\n${receptie.ingredients.join('\n')}\n
        ${getHiddenLink(receptie.resultphoto, "HTML")}\n
        `,
        {
            parse_mode: "HTML",
        }
    )
    await sleep(100)
    for (let instruction of receptie.instruction) {
        await sleep(200)
        if (instruction.indexOf('img') != -1) await ctx.sendPhoto(instruction)
        else await ctx.sendMessage(instruction)
    }
}