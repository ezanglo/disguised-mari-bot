import * as cheerio from 'cheerio';
import qs from 'query-string';
import { DataData, InfoboxData, InfoboxProps, SkillData } from 'wiki-helper';
import { capitalizeFirstLetter, parseHtmlImage, stripHtml, toCamelCase } from './utils';

export async function fetchWikiData(params: object, newHero: boolean = false) {
  const url = qs.stringifyUrl({
    url: "https://grandchase.fandom.com/api.php",
    query: {
      format: "json",
      ...params
    }
  });

  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();

  if ('error' in data) {
    if (data.error.code.includes('missing')) {
      throw new Error(newHero ? 'not-found' : 'new-hero');
    }
  }

  return data;
}

function getPageName(hero: string[], newHero: boolean = false) {
  let [heroName, upgrade, type] = hero;
  
  if(upgrade === 'Dimensional_Chaser'){
    upgrade = type;
  }

  const data = [capitalizeFirstLetter(heroName)];
  if (!newHero) {
    data.push('Dimensional_Chaser');
  }
  if (upgrade) {
    data.push(upgrade);
  }
  return data.join('/');
}

function getImageString(image?: string) {
  return image?.replace(/\/revision\/.*$/, '') || '';
}

export async function getGallery(hero: string[], newHero: boolean = false) {
  const gallerySection = await getSection(hero, "Gallery", newHero);
  const data = await fetchWikiData({
    action: "parse",
    page: getPageName(hero, newHero),
    prop: "text",
    section: gallerySection.index,
  }, newHero);

  const gallery = data.parse.text['*'];
  const $ = cheerio.load(gallery);

  let galleryImages = extractTabbedGallery($);
  if (!galleryImages["icons"]) {
    galleryImages = extractFlatGallery($);
  }

  return galleryImages;
}

function extractTabbedGallery($: cheerio.CheerioAPI) {
  const galleryImages: { [key: string]: Array<{ label: string, type: string, image: string }> } = {};
  $('.tabber.wds-tabber').eq(0).find('.wds-tabs__tab').each((index, tab) => {
    const tabName = toCamelCase($(tab).text().trim());
    const tabContent = $('.wds-tab__content').eq(index);
    galleryImages[tabName] = tabContent.find('.wikia-gallery-item').map((_, item) => {
      const $item = $(item);
      const $caption = $item.find('.lightbox-caption');
      const label = $caption.find('b').text().trim();
      const type = $caption.find('i').text().replace(/[()]/g, '').trim();
      const $img = $item.find('.gallery-image-wrapper img');
      let image = $img.attr('data-src') || $img.attr('src') || '';
      image = getImageString(image);

      return { label, type, image };
    }).get();
  });
  return galleryImages;
}

function extractFlatGallery($: cheerio.CheerioAPI) {
  const galleryImages: { [key: string]: Array<{ label: string, type: string, image: string }> } = {};

  galleryImages['icons'] = $('.wikia-gallery-item').map((_, item) => {
    const $item = $(item);
    const $caption = $item.find('.lightbox-caption').text().trim();
    const $img = $item.find('.gallery-image-wrapper img');
    let image = $img.attr('data-src') || $img.attr('src') || '';
    image = getImageString(image);

    return { label: $caption, type: $caption, image };
  }).get();

  return galleryImages;
}

export async function getHeroIcon(hero: string[], newHero: boolean = false) {

  const gallerySection = await getSection(hero, "Gallery", newHero);

  const data = await fetchWikiData({
    action: "parse",
    page: getPageName(hero, newHero),
    prop: "text",
    section: gallerySection.index,
  }, newHero);

  const gallery = data.parse.text['*'];
  const $ = cheerio.load(gallery);

  let iconSrc: string | null = null;

  const tabber = $('.tabber.wds-tabber').eq(0);
  const iconTabIndex = tabber.find('.wds-tabs__tab[data-hash="Icons"]').index();

  if (iconTabIndex !== -1) {
    const iconsTabContent = tabber.find('.wds-tab__content').eq(iconTabIndex);

    const soulImprintDiv = iconsTabContent.find('.wikia-gallery-item').filter((_, el) => {
      return $(el).find('.lightbox-caption').text().includes('Soul Imprint');
    }).first();

    if (soulImprintDiv.length) {
      const iconImg = soulImprintDiv.find('.gallery-image-wrapper img').first();
      iconSrc = iconImg.attr('data-src') || iconImg.attr('src') || '';
      iconSrc = getImageString(iconSrc);
    }
  }

  if (!iconSrc) {
    console.log("No Soul Imprint image found in the Icons tab");
  }

  return iconSrc;
}

export async function getDetails(hero: string[], newHero: boolean = false) {

  const data = await fetchWikiData({
    action: "parse",
    page: getPageName(hero, newHero),
    prop: "properties",
  }, newHero);

  const infobox = JSON.parse(data.parse.properties[0]['*']) as InfoboxProps[];
  const infoboxData = infobox[0].data;

  return {
    title: extractTitle(infoboxData),
    media: extractMedia(infoboxData),
    details: extractDetails(infoboxData),
  };
}

// New helper functions for getDetails
function extractTitle(infoboxData: InfoboxData[]) {
  return infoboxData.find(i => i.type === 'title')?.data.value.replace('<br>', '').split('<br/>');
}

function extractMedia(infoboxData: InfoboxData[]) {
  return infoboxData.find(i => i.type === 'image')?.data.map(i => ({
    url: i.url,
    name: i.name,
    alt: i.alt,
  }));
}

export type DetailData = { label: string, value: string | string[] }

function extractDetails(infoboxData: InfoboxData[]) {
  const details = [] as DetailData[];
  infoboxData.filter(i => i.type === 'group').forEach(group => {
    group.data.value
      .filter(i => i.type === 'data')
      .forEach(item => {
        details.push(processDetailItem(item));
      });
  });
  return details;
}

function processDetailItem(item: {
  type: 'data',
  data: DataData
}) {

  const label = toCamelCase(item.data.label);
  const itemValue = item.data.value;
  let value = {
    label: item.data.label,
    value: stripHtml(itemValue),
  } as { label: string, value: string | string[], image?: string };

  switch (label) {
    case "tier":
    case "type":
    case "attribute":
    case "pet":
      const { imageName, imageSrc } = parseHtmlImage(itemValue);

      let labelValue = imageName;
      if(label === 'pet'){
        labelValue = stripHtml(itemValue).trim() || imageName
      }

      value = {
        ...value,
        value: labelValue,
        image: getImageString(imageSrc),
      }
      break;
    case "features":
      value = {
        ...value,
        value: stripHtml(itemValue).split('/').map(feature => capitalizeFirstLetter(feature.trim())),
      }
      break;
    case "family":
      value = {
        ...value,
        value: stripHtml(itemValue).split(',').map(feature => feature.trim()),
      }
      break;
    case "alternativeNames":
      value = {
        ...value,
        value: itemValue.split('/').map(name => name.trim()),
      }
      break;
    case "exclusiveEquipment":
      value = {
        ...value,
        value: cheerio.load(itemValue).text().split('/').map(i => i.trim()),
      }
      break;
    case "playableSince":
      const dates = stripHtml(itemValue);
      const $ = cheerio.load(itemValue);
      const flagCodes = $('a.image img').map((_, el) => $(el).attr('alt')?.replace('Flag ', '').toUpperCase()).get();

      const dateArray = dates.split(/(?<=\d{4})\s+/)
        .map(date => date.trim())
        .filter(date => date !== '');

      value = {
        ...value,
        label: "Release Dates",
        value: dateArray.map((date, index) => `${flagCodes[index]} - ${date}`),
      };
      break;
  }

  let currentValue = value.value;
  if(label === 'tier') {
    currentValue = processTier(value.value as string) || value.value;
  }
  if(label === 'type') {
    currentValue = processClass(value.value as string) || value.value;
  }
  if(label === 'attribute') {
    currentValue = processAttribute(value.value as string) || value.value;
  }

  return {
    ...value,
    value: currentValue
  };
}

function processTier(data: string){
  switch(data){
    case 'Rank-SS.png': return 'sr'
    case 'Rank-S.png': return 's'
    case 'Rank-T.png': return 't'
    case 'Rank-A.png': return 'a'
  }
}

function processAttribute(data: string){
  switch(data){
    case 'ATTR-Judgment.png': return 'balance_blue'
    case 'ATTR-Life.png': return 'life_green'
    case 'ATTR-Hellfire.png': return 'retribution_red'
    case 'ATTR-Cycles.png': return 'cycle_light'
    case 'ATTR-Destruction.png': return 'ruin_dark'
  }
}

function processClass(data: string){
  switch(data){
    case 'Type-Ranged.png': return 'ranger'
    case 'Type-Assault.png': return 'assault'
    case 'Type-Tank.png': return 'tank'
    case 'Type-Mage.png': return 'mage'
    case 'Type-Support.png': return 'healer'
  }
}

export async function getSection(hero: string[], section: string, newHero: boolean = false) {
  const sectionsData = await fetchWikiData({
    action: "parse",
    page: getPageName(hero, newHero),
    prop: "sections",
  }, newHero);

  return sectionsData.parse.sections.find((i: any) => i.line === section);
}

export async function getSkills(hero: string[], newHero: boolean = false) {
  const [_, type] = hero;
  const skillSection = await getSection(hero, "Skills", newHero);
  const skillData = await fetchWikiData({
    action: "parse",
    page: getPageName(hero, newHero),
    section: skillSection.index,
    prop: "text",
  }, newHero);

  const skills = skillData.parse.text['*'];
  const $ = cheerio.load(skills);

  let extractedSkills = extractTabbedSkills($);
  if (extractedSkills.length === 0) {
    extractedSkills = extractFlatSkills($);
  }
  const chaserSkill = extractChaserSkill($, type);
  if (chaserSkill.name) {
    extractedSkills.push(chaserSkill);
  }
  return extractedSkills;
}

// New helper functions for getSkills
function extractFlatSkills($: cheerio.CheerioAPI) {
  const extractedSkills: SkillData[] = [];
  let currentCategory = '';

  $('table.wikitable').eq(0).find('tbody tr').each((index, row) => {
    const $row = $(row)
    const $cells = $row.find('td, th');

    if ($cells.length === 1 && $cells.attr('colspan') === '5') {
      currentCategory = $cells.text().trim();
      return;
    }

    const skillName = $cells.eq(1).find('b').first().text().trim();
    const skillDescription = $cells.eq(4).html()?.replace(/<i>.*?<\/i>/, '').trim() || '';
    const $img = $cells.eq(0).find('img');
    let skillImage = $img.attr('data-src') || $img.attr('src') || '';
    skillImage = getImageString(skillImage);
    const sp = $cells.eq(2).text().trim();
    const cooldown = $cells.eq(3).text().trim();

    let skillType = currentCategory;
    if (skillType === "ACTIVE") {
      skillType = index === 2 ? "SKILL1" : index === 3 ? "SKILL2" : currentCategory
    }

    if (skillName && skillDescription && skillType !== 'ACTIVE') {
      extractedSkills.push({
        name: skillName,
        skillType,
        description: skillDescription,
        image: skillImage,
        sp,
        cooldown,
      });
    }
  });

  return extractedSkills;
}

function extractTabbedSkills($: cheerio.CheerioAPI) {
  const extractedSkills: SkillData[] = [];
  let currentCategory = '';
  let currentSkill: SkillData | null = null;

  $('.tabber.wds-tabber').eq(0).find('.wds-tab__content').each((tabIndex, tabContent) => {
    const isUpgraded = tabIndex === 1;
    $(tabContent).find('table.wikitable').each((_, table) => {
      $(table).find('tbody tr').each((index, row) => {
        const $row = $(row);
        const $cells = $row.find('td, th');

        if ($cells.length === 1 && $cells.attr('colspan') === '5') {
          currentCategory = $cells.text().trim();
          return;
        }

        const skillName = $cells.eq(1).find('b').first().text().trim();
        const skillDescription = $cells.eq(4).html()?.replace(/<i>.*?<\/i>/, '').trim() || '';
        const $img = $cells.eq(0).find('img');
        let skillImage = $img.attr('data-src') || $img.attr('src') || '';
        skillImage = getImageString(skillImage);
        const sp = $cells.eq(2).text().trim();
        const cooldown = $cells.eq(3).text().trim();

        let skillType = currentCategory;
        if (skillType === "ACTIVE") {
          skillType = index === 2 ? "SKILL1" : index === 3 ? "SKILL2" : currentCategory
        }

        if (skillName && skillDescription) {
          if (isUpgraded) {
            const existingSkill = extractedSkills.find(s => s.name === skillName);
            if (existingSkill) {
              existingSkill.upgrades?.push({
                level: 'Upgraded',
                description: skillDescription,
                image: skillImage
              });
            }
          } else {
            if (currentSkill) {
              extractedSkills.push(currentSkill);
            }
            currentSkill = {
              name: skillName,
              skillType,
              description: skillDescription,
              image: skillImage,
              sp,
              cooldown
            };
          }
        } else if (currentSkill && skillDescription) {
          // This is an upgrade for the current skill
          currentSkill.upgrades?.push({
            level: $cells.eq(1).text().trim(),
            description: skillDescription,
            image: skillImage
          });
        }
      });
    });

    // Push the last skill of the tab
    if (currentSkill && !isUpgraded) {
      extractedSkills.push(currentSkill);
      currentSkill = null;
    }
  });

  return extractedSkills;
}

function extractChaserSkill($: cheerio.CheerioAPI, type: string | undefined) {
  const chaserSkill: SkillData = {
    name: '',
    skillType: 'CHASER',
    description: '',
    pvpDescription: '',
    image: '',
    sp: 'N/A',
    cooldown: 'N/A',
    upgrades: [],
  };

  $('.tabber.wds-tabber').eq(type ? 0 : 1).find('.wds-tab__content').each((tabIndex, tabContent) => {
    const isPvP = tabIndex === 1;
    $(tabContent).find('table.wikitable').each((_, table) => {
      let currentSection = '';
      let additionalEffectImages = [] as string[];

      $(table).find('tbody tr').each((_, row) => {
        const $row = $(row);
        const $th = $row.find('th[colspan="4"]');

        if ($th.length > 0) {
          currentSection = $th.text().trim().toUpperCase();
          return;
        }

        switch (currentSection) {
          case 'DEFAULT':
            chaserSkill.name = $row.find('td').eq(1).find('b').text().trim();
            chaserSkill.image = $row.find('td').eq(0).find('img').attr('data-src') || $row.find('td').eq(0).find('img').attr('src') || '';
            chaserSkill.image = getImageString(chaserSkill.image);
            if (isPvP) {
              chaserSkill.pvpDescription = $row.find('td').eq(2).html() || '';
            } else {
              chaserSkill.description = $row.find('td').eq(2).html() || '';
            }
            break;
          case 'UPGRADED':
            const firstRow = $row.find('td').eq(0).html() || '';
            const levelMatch = firstRow.match(/LVL\s*(\d+)/i);
            if (levelMatch) {
              const level = levelMatch[0].trim();

              const description = $row.find('td').eq(3).html() || $row.find('td').eq(1).html() || '';

              if (isPvP) {
                const upgradeIndex = chaserSkill.upgrades?.findIndex(u => u.level === level);
                if (upgradeIndex != undefined && upgradeIndex !== -1 && chaserSkill.upgrades) {
                  chaserSkill.upgrades[upgradeIndex].pvpDescription = description;
                }
              }
              else {
                chaserSkill.upgrades?.push({
                  level: level === 'LVL1' ? 'LVL 1' : level,
                  description,
                  image: chaserSkill.image || '',
                });
              }
            }
            break;
          case 'ADDITIONAL EFFECT':
            const level = _ === 8 ? 'LVL 1/2' : 'LVL 2/2';
            const description = $row.find('td').eq(2).html() || $row.find('td').eq(1).html() || '';

            let image = '';
            if (level === 'LVL 1/2') {
              additionalEffectImages = $row.find('td').eq(0).find('img').map((_, img) => $(img).attr('data-src')).get().filter(Boolean);
              image = getImageString(additionalEffectImages[0]);
            }
            else {
              image = getImageString(additionalEffectImages[1]);
            }

            if (isPvP) {
              const additionalEffectIndex = chaserSkill.upgrades?.findIndex(u => u.level === level);
              if (additionalEffectIndex != undefined && additionalEffectIndex !== -1 && chaserSkill.upgrades) {
                chaserSkill.upgrades[additionalEffectIndex].pvpDescription = description;
              }
            }
            else {
              chaserSkill.upgrades?.push({
                level,
                description,
                image
              });
            }
            break;
        }
      });
    });
  });

  return chaserSkill;
}

export type Tier = 'SS' | 'S' | 'A' | 'T';

export async function getHeroes(tier: Tier) {
  const response = await fetchWikiData({
    action: 'parse',
    text: `{{Template:GCkakao ${tier}}}`,
    prop: 'text'
  });

  const html = response.parse.text['*'];
  const $ = cheerio.load(html);

  const heroes = [] as { name: string, wikiPage?: string, imageUrl?: string, attribute?: string, tier: Tier }[];

  $('td[style*="font-size:11px"]').each((index, element) => {
    const $element = $(element);
    const name = $element.find('span[style="color: #ffffff;"]').text().trim();
    let imageUrl = $element.find('img').first().attr('data-src') || $element.find('img').first().attr('src');
    imageUrl = getImageString(imageUrl);
    const wikiPage = $element.find('a').first().attr('href')?.replace("/wiki/", "");
    const attributeImg = $element.find('img').last();
    const attribute = attributeImg.attr('alt')?.replace('ATTR-', '') || 'Unknown';

    if (name && imageUrl) {
      heroes.push({ name, wikiPage, imageUrl, attribute, tier });
    }
  });

  return heroes;
}