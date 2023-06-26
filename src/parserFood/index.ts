import sequlize from "../database/database.js";
import { getListUrlRecepts, getMaxPage } from "../utils/index.js";
import * as CONFIG from './config.js';

const basicUrl = 'https://1000.menu/catalog'

export async function parseRecepts() {
   // sequlize.models.recepts.truncate({ cascade: true, restartIdentity: true });

    for (let category of CONFIG.CATEGORY) {
        const maxPage = await getMaxPage(basicUrl + '/' + category)
        if (!maxPage) continue;
        for (let index = 1; index < maxPage; index++) {
            const receptsUrl = await getListUrlRecepts(basicUrl + '/' + category + '/' + index)
              for (const recept of receptsUrl) {
                if (await sequlize.models.recepts.findOne({
                    where: {
                        src: recept
                    }
                })) continue;
                await sequlize.models.recepts.create({
                    category: category,
                    src: recept
                })
              }
        }
    }
}