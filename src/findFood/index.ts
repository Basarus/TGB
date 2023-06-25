import { bot } from "../app.js";
import { encodindString } from "../utils/index.js";
import { getReceptiesForSite } from "./findFood.js";

export async function findFood(type) {
    let text = "Полный рецепт (и многие другие) Вы мож ете получить у нашего бота @food1over_bot по коду"
    console.log(text)
    // const receptie = await getReceptiesForSite(type);
    // await bot?.bot.telegram?.sendMessage('@my_world_foodlover', receptie.name)
    // if (receptie.discription) await bot?.bot.telegram?.sendMessage('@my_world_foodlover', receptie.discription)
    // await bot?.bot.telegram?.sendPhoto('@my_world_foodlover', receptie.resultphoto)
    // await bot?.bot.telegram?.sendMessage('@my_world_foodlover', receptie.ingredients.join('\n'))
    // if (receptie.code != null) await bot?.bot.telegram?.sendMessage('@my_world_foodlover', text)
}
