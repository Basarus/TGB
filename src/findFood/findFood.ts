import axios from "axios"
import cheerio from 'cheerio';
import iconv from 'iconv-lite';
import { getMaxPage, getListUrlRecepts, getHTML } from "../utils/index.js";
import sequlize from "../database/database.js";

const url = 'https://1000.menu/catalog'

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}


export async function getReceptiesForSite(type) {
    let urlPage = url + '/' + type;
    let maxPages = await getMaxPage(urlPage);
    let randomPage = getRandomIntInclusive(1, maxPages - 1);
    let listRecepts = await getListUrlRecepts(urlPage + '/' + randomPage);
    let random = getRandomIntInclusive(0, listRecepts.length - 1)
    return await getShortRecept(listRecepts[random], type)
}

async function getShortRecept(receptUrl, type) {
    let url = "https://1000.menu" + '/cooking/' + receptUrl
    const fetchTitles = async () => {
        try {
            const html = await getHTML(url)
            const $ = cheerio.load(html);
            const recept = {
                code: null,
                time: null,
                colories: {
                    colories: null,
                    fate: null,
                    ugl: null,
                    belk: null
                },
                name: null,
                discription: null,
                ingredients: [],
                resultphoto: null,
                instruction: []
            };

            let databaseData = (await sequlize.models.recepts.findOne(
                {
                    where: {
                        src: url.replace('https://1000.menu/cooking/', '')
                    }
                }
            )).dataValues
            if (databaseData.id) recept.code = databaseData.id
            $('h1').each((_idx, el) => {
                if (el.attribs.itemprop == 'name') recept.name = $(el).text()
            });
            $('div[class="description is-citation"]').each((_idx, el) => {
             recept.discription = $(el).text()
            });
            $('span[class="label"]').each((_idx, el) => {
                let text = $(el).text()
                if (text.indexOf('Время приготовления: ') != -1) recept.time = $(el).text()
            });
            $('span[id="nutr_p"]').each((_idx, el) => {
                recept.colories.belk = $(el).text()
            });
            $('span[id="nutr_f"]').each((_idx, el) => {
                recept.colories.fate = $(el).text()
            });
            $('span[id="nutr_c"]').each((_idx, el) => {
                recept.colories.ugl = $(el).text()
            });
            $('span[id="nutr_kcal"]').each((_idx, el) => {
                recept.colories.colories = $(el).text()
            });
            $('meta').each((_idx, el) => {
                if (el.attribs.itemprop == 'recipeIngredient') recept.ingredients.push('- ' + el.attribs.content)
            });
            $('img').each((_idx, el) => {
                if (el.attribs.class == 'result-photo bl photo') recept.resultphoto = el.attribs.src.replace('//', '')
            });
            $('a[class="step-img foto_gallery"]').each((_idx, el) => {
                if (el.attribs.href) {
                    let img = el.attribs.href.replace('//', '')
                    recept.instruction.push(img)
                }
                if (el.attribs.title) recept.instruction.push(el.attribs.title)
            });
            if (recept.instruction.length <= 0) return await getReceptiesForSite(type)
            return recept
        } catch (error) {
            return null
        }
    };

    return await fetchTitles()
}

export async function findFoodById(code) {
    let databaseData = (await sequlize.models.recepts.findOne(
        {
            where: {
                id: code
            }
        }
    )).dataValues
    if (databaseData == undefined) return null;
    else return await getFullRecept("https://1000.menu/cooking/" + databaseData.src)
}

export async function getFullReceptiesForSite(type) {
    let urlPage = url + '/' + type;
    let maxPages = await getMaxPage(urlPage);
    let randomPage = getRandomIntInclusive(1, maxPages - 1);
    let listRecepts = await getListUrlRecepts(urlPage + '/' + randomPage);
    let random = getRandomIntInclusive(0, listRecepts.length - 1)
    return await getFullRecept("https://1000.menu/cooking/" + listRecepts[random])
}

export async function getFullRecept(receptUrl) {

    try {
        const html = await getHTML(receptUrl)
        const $ = cheerio.load(html);
        const recept = {
            code: null,
            time: null,
            colories: {
                colories: null,
                fate: null,
                ugl: null,
                belk: null
            },
            name: null, 
            discription: null,
            ingredients: [],
            resultphoto: null,
            instruction: []
        };

        $('h1').each((_idx, el) => {
            if (el.attribs.itemprop == 'name') recept.name = $(el).text()
        });
        $('div[class="description is-citation"]').each((_idx, el) => {
         recept.discription = $(el).text()
        });
        $('span[class="label"]').each((_idx, el) => {
            let text = $(el).text()
            if (text.indexOf('Время приготовления: ') != -1) recept.time = $(el).text()
        });
        $('span[id="nutr_p"]').each((_idx, el) => {
            recept.colories.belk = $(el).text()
        });
        $('span[id="nutr_f"]').each((_idx, el) => {
            recept.colories.fate = $(el).text()
        });
        $('span[id="nutr_c"]').each((_idx, el) => {
            recept.colories.ugl = $(el).text()
        });
        $('span[id="nutr_kcal"]').each((_idx, el) => {
            recept.colories.colories = $(el).text()
        });
        $('meta').each((_idx, el) => {
            if (el.attribs.itemprop == 'recipeIngredient') recept.ingredients.push('- ' + el.attribs.content)
        });
        $('img').each((_idx, el) => {
            if (el.attribs.class == 'result-photo bl photo') recept.resultphoto = el.attribs.src.replace('//', '')
        });
        $('a[class="step-img foto_gallery"]').each((_idx, el) => {
            if (el.attribs.href) {
                let img = el.attribs.href.replace('//', '')
                recept.instruction.push(img)
            }
            if (el.attribs.title) recept.instruction.push(el.attribs.title)
        });
        if (recept.instruction.length <= 0) return null;
        return recept
    } catch (err) {
        console.log(err)
        return null;
    }
}
