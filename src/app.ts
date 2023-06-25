import { Telegraf } from "telegraf";
import { IConfigService } from "./config/config.interface.js";
import { ConfigService } from "./config/config.service.js";
import { IBotContext } from "./context/context.interface.js";
import { Command } from "./commands/command.class.js";
import { StartCommand } from "./commands/start.command.js";
import LocalSession from "telegraf-session-local";
import './database/index.js'
import { parseRecepts } from "./parserFood/index.js";
import './schedule/index.js';

class Bot {

  bot: Telegraf<IBotContext>
  commands: Command[] = [];

  constructor(private readonly configService: IConfigService) {
    
    this.bot = new Telegraf<IBotContext>(this.configService.get("TOKEN"));
   
    this.bot.use(
      new LocalSession({
        database: "sessions.json"
      }).middleware()
    )

  }

 async init() {
    this.commands = [new StartCommand(this.bot)]
    for (const command of this.commands) {
      command.handle()
    }
    this.bot.launch()

    // parseRecepts()
  }
}

export const bot = new Bot(new ConfigService())
bot.init()

