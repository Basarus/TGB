import { bot } from "../app.js";
import { encodindString } from "../utils/index.js";
import { getReceptiesForSite, findFoodById} from "./findFood.js";

export async function findFood(type) {
    const receptie = await getReceptiesForSite(type);
    let text = `Полный рецепт (а так же многие другие) доступен по коду ${receptie.code} \n у бота @food1over_bot`
    await bot?.bot.telegram?.sendMessage('@my_world_foodlover', receptie.name)
    if (receptie.discription) await bot?.bot.telegram?.sendMessage('@my_world_foodlover', receptie.discription)
    await bot?.bot.telegram?.sendPhoto('@my_world_foodlover', receptie.resultphoto)
    await bot?.bot.telegram?.sendMessage('@my_world_foodlover', receptie.ingredients.join('\n'))
    if (receptie.code != null) await bot?.bot.telegram?.sendMessage('@my_world_foodlover', text)
}

export async function getFoodByCode(ctx, code) {
    let receptie = await findFoodById(code);
    if (receptie == null) return;
    await ctx.sendMessage(receptie.name)
    if (receptie.discription) await ctx.sendMessage(receptie.discription)
    await ctx.sendPhoto(receptie.resultphoto)
    await ctx.sendMessage(receptie.ingredients.join('\n'))
    for (let instruction of receptie.instruction){
        if (instruction.indexOf('img') != -1) await ctx.sendPhoto(instruction)
        else await ctx.sendMessage(instruction)
    }
}