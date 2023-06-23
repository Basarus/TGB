import { IBotContext } from "../context/context.interface";
import { getReceptieForSite } from "../findFood/findFood";
import { Command } from "./command.class";
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
        let receptie = await getReceptieForSite(type);
        await ctx.sendMessage(receptie.name)
        await ctx.sendPhoto(receptie.resultphoto)
        await ctx.sendMessage(receptie.ingredients.join('\n'))
        for (let e of receptie.instruction) {
            if (e == ' ') continue;
            await sleep(200)
            if (e.indexOf('img') != -1) await ctx.sendPhoto(e)
            else await ctx.sendMessage(e)
        }
        this.start()
    }

    start(){
        this.bot.start((ctx) => {
            ctx.reply("Здравствуйте!", Markup.inlineKeyboard([
                Markup.button.callback("Категории", "get_category"),
                Markup.button.callback("Получить случайный рецепт", "get_random_recept"),
            ]))
        }) 
    }


    handle(): void {
       this.start()


        this.bot.action('get_category', (ctx) => {
            ctx.deleteMessage()
            ctx.reply("Выберите категорию", Markup.inlineKeyboard([
                Markup.button.callback("Время суток", "time_of_day")
            ]))
        })


        this.bot.action("time_of_day", (ctx) => {
            ctx.deleteMessage()
            ctx.reply("Выберите категорию", Markup.inlineKeyboard([
                Markup.button.callback("Утро", "utro"),
                Markup.button.callback("День", "day"),
                Markup.button.callback("Вечер", "vecher")
            ]))
        })


        this.bot.action("utro", async (ctx) => {
            this.findFood(ctx, 'breakfast')
        })
        this.bot.action("day", async (ctx) => {
            this.findFood(ctx, 'lunch')
        })
        this.bot.action("vecher", async (ctx) => {
            this.findFood(ctx, 'dinner')
        })
    }
}