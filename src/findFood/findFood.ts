import axios from "axios"
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const fs = require("fs");
const url = 'https://www.iamcook.ru/event/everyday/everyday-'

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
  }

export async function getReceptieForSite(type) {
    const fetchTitles = async () => {
        try {
            const response = await axios.get(url + type);

            const html = response.data;

            const $ = cheerio.load(html);

            const titles = [];

            $('a').each((_idx, el) => {
                const title = $(el).attr('href')
                if (title.indexOf('showrecipe') != -1) titles.push(title)
            });

            return titles;
        } catch (error) {
            throw error;
        }
    };

    return await fetchTitles().then(async (titles) => {
        let random = getRandomIntInclusive(0, titles.length - 1)
        return await getRecept(titles[random])
    });
}

async function getRecept(receptUrl) {
    let url = "https://www.iamcook.ru" + receptUrl
    const fetchTitles = async () => {
        try {
            
            const res = await fetch(url);
              
              const charset = (res.headers.get('content-type') ?? '')
                .split(/\s*;\s*/).find(
                  (/** @type {string} */ x) => x.startsWith('charset')
                )?.replace(/charset=/, '');
              
              const buf = await res.arrayBuffer();
              const html = iconv.decode(
                Buffer.from(buf),
                charset || 'windows-1251'
              );

            const $ = cheerio.load(html);

            const titles = {
                name: null,
                ingredients: [],
                resultphoto: null,
                instruction: []
            };
            $('h1').each((_idx, el) => {
                if (el.attribs.itemprop == 'name') titles.name = $(el).text()
            });
            $('p').each((_idx, el) => {
                if (el.attribs.itemprop == 'recipeIngredient') titles.ingredients.push($(el).text())
            });
            $('img').each((_idx, el) => {
              if (el.attribs.class == 'resultphoto') titles.resultphoto = el.attribs.src.replace('//', '')
               
            });
            $('div[class="instructions"]').find('p').each((_idx, el) => {
                    if (el.children[0]?.attribs?.src){ 
                        let src = el.children[0]?.attribs?.src.replace('//', '')
                        titles.instruction.push(src)
                    }
                    else {
                        let text = $(el).text().replace(/[\n\t\r]/g,"")
                        if (text != '') titles.instruction.push(text)
                    }
            });
            return titles
        } catch (error) {
            throw error;
        }
    };

    return await fetchTitles()
}