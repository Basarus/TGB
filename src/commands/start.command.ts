import { IBotContext } from "../context/context.interface.js";
import sequlize from "../database/database.js";
import { getReceptiesForSite } from "../findFood/findFood.js";
import { findFood } from "../findFood/index.js";
import { parseRecepts } from "../parserFood/index.js";
import { Command } from "./command.class.js";
import { Markup, Telegraf } from 'telegraf'

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export class StartCommand extends Command {
    constructor(bot: Telegraf<IBotContext>) {
        super(bot)
    }


    async findFood(ctx, type) {
        ctx.deleteMessage()
        let receptie = await getReceptiesForSite(type);
        await ctx.telegram.sendMessage('@my_world_foodlover', receptie.name)
        if (receptie.discription) await ctx.telegram.sendMessage('@my_world_foodlover', receptie.discription)
        await ctx.telegram.sendPhoto('@my_world_foodlover', receptie.resultphoto)
        await ctx.telegram.sendMessage('@my_world_foodlover', receptie.ingredients.join('\n'))
        if (receptie.code != null) await ctx.telegram.sendMessage('@my_world_foodlover', `Полный рецепт (и многие другие) Вы можете получить у нашего бота @food1over_bot по коду ${receptie.code}`)
    }

    start(){
        this.bot.start(async (ctx) => {
            ctx.reply("Здравствуйте!", Markup.inlineKeyboard([
                Markup.button.callback("Категории", "categories"),
                Markup.button.callback("Получить случайный рецепт", "get_random_recept"),
            ]))
        }) 
    }


   async handle() {
       this.start()


        this.bot.action('categories', (ctx) => {
            ctx.deleteMessage()
            ctx.reply("Выберите категорию", Markup.inlineKeyboard([
                Markup.button.callback("Выпечка", "vjpechka"),
                Markup.button.callback("Супы", "supj"),
                Markup.button.callback("Второе блюдо", "vtoroe-bludo")
            ]))
        })

        this.bot.action("vjpechka", async (ctx) => {
            this.findFood(ctx, 'vjpechka')
        })
        this.bot.action("supj", async (ctx) => {
            this.findFood(ctx, 'supj')
        })
        this.bot.action("vtoroe-bludo", async (ctx) => {
            this.findFood(ctx, 'vtoroe-bludo')
        })
    }
}