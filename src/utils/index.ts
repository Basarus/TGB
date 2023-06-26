import axios from "axios"
import cheerio from 'cheerio';
import iconv from 'iconv-lite';

export async function getMaxPage(url: string) {
    const response = await axios.get(url);

    const html = response.data;

    const $ = cheerio.load(html);

    const pages = [];

    $('a[class="cb as-icon my-0 py-1 mr-1 is-flex-shrink-0"]').each((_idx, el) => {
        if ($(el).attr('href')) {
            let arr = $(el).attr('href').split('/')
            let number = arr[arr.length - 1]
            if (pages.indexOf(number) == -1) pages.push(number)
        }
    });
    return Math.max.apply(null, pages)
}

export async function getListUrlRecepts(url: string) {
    const response = await axios.get(url);

    const html = response.data;

    const $ = cheerio.load(html);

    const titles = [];

    $('a[class="h5"]').each((_idx, el) => {
        const title = $(el).attr('href')
        if (title && title.indexOf('/cooking/') != -1) titles.push(title.replace('/cooking/', ''))
    });

    return titles;
}

export async function getHTML(url: string) {
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
    return html
}

export function encodindString(str: string): string{
    const text = iconv.decode(
        Buffer.from(str),
        'windows-1251'
      );
    return text
}

export function getHiddenLink(url, parse_mode = "markdown") {
  const emptyChar = "‎"; // copied and pasted the char from https://emptycharacter.com/

  switch (parse_mode) {
    case "markdown":
      return `[${emptyChar}](${url})`;
    case "HTML":
      return `<a href="${url}">${emptyChar}</a>`;
    default:
      throw new Error("invalid parse_mode");
  }
}

export function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}
