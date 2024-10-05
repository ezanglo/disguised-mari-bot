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

	if (upgrade === 'Dimensional_Chaser') {
		upgrade = type;
	}

	const data = [capitalizeFirstLetter(heroName)];
	if (!newHero) {
		data.push('Dimensional_Chaser');
	}
	if (upgrade) {
		data.push(upgrade.toUpperCase());
	}
	return data.join('/');
}

function getImageString(image?: string) {
	return image?.replace(/\/revision\/.*$/, '') || '';
}

export async function getGallery(hero: string[], newHero: boolean = false) {
	const gallerySection = await getSection(hero, "Gallery", newHero);
	if (!gallerySection) {
		return { 'icons': [] }
	}
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

export type GalleryData = { label: string, type: string, image: string }

export type GalleryType = {
	[key: string]: GalleryData[]
}

function extractTabbedGallery($: cheerio.CheerioAPI) {
	const galleryImages: GalleryType = {};
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
	if (!gallerySection) {
		return '';
	}

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
			if (label === 'pet') {
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
	if (label === 'tier') {
		currentValue = processTier(value.value as string) || value.value;
	}
	if (label === 'type') {
		currentValue = processClass(value.value as string) || value.value;
	}
	if (label === 'attribute') {
		currentValue = processAttribute(value.value as string) || value.value;
	}

	return {
		...value,
		value: currentValue
	};
}

function processTier(data: string) {
	switch (data) {
		case 'Rank-SS.png':
			return 'sr'
		case 'Rank-S.png':
			return 's'
		case 'Rank-T.png':
			return 't'
		case 'Rank-A.png':
			return 'a'
	}
}

function processAttribute(data: string) {
	switch (data) {
		case 'ATTR-Judgment.png':
			return 'balance_blue'
		case 'ATTR-Life.png':
			return 'life_green'
		case 'ATTR-Hellfire.png':
			return 'retribution_red'
		case 'ATTR-Cycles.png':
			return 'cycle_light'
		case 'ATTR-Destruction.png':
			return 'ruin_dark'
	}
}

function processClass(data: string) {
	switch (data) {
		case 'Type-Ranged.png':
			return 'ranger'
		case 'Type-Assault.png':
			return 'assault'
		case 'Type-Tank.png':
			return 'tank'
		case 'Type-Mage.png':
			return 'mage'
		case 'Type-Support.png':
			return 'healer'
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
	if (!skillSection) {
		return [];
	}

	const skillData = await fetchWikiData({
		action: "parse",
		page: getPageName(hero, newHero),
		prop: "text",
	}, newHero);

	const skills = skillData.parse.text['*'];
	const $ = cheerio.load(skills);

	let extractedSkills = extractTabbedSkills($);
	if (extractedSkills.length === 0) {
		extractedSkills = extractFlatSkills($);
	}

	extractedSkills.forEach(skill => {
		if (skill.skillType) {
			skill.skillType = processSkillType(skill.skillType);
		}
	});

	let chaserSkill = extractChaserSkill($);
	if(!chaserSkill) {
		chaserSkill = extractFlatChaserSkill($)
	}

	if (chaserSkill && chaserSkill?.name) {
		extractedSkills.push(chaserSkill);
	}

	const soulImprintSkills = extractSoulImprintSkill($);
	if(soulImprintSkills.length > 0){
		soulImprintSkills.forEach((skill: any) => {
			const existingSkill = extractedSkills.find((s: any) => s.skillType === skill.skillType);
			if (existingSkill) {
				if(!existingSkill.upgrades){
					existingSkill.upgrades = []
				}
				existingSkill.upgrades?.push({
					upgradeType: 'si',
					description: skill.description,
					image: skill.image
				});
			}
		});
	}

	return extractedSkills;
}

export async function getSoulImprintSkills(hero: string[], newHero: boolean = false) {
	const [_, type] = hero;
	const extractedSkills = [];
	const soulImprintSection = await getSection(hero, "Soul Imprint", newHero);
	if (!soulImprintSection) {
		return [];
	}
	const soulImprintData = await fetchWikiData({
		action: "parse",
		page: getPageName(hero, newHero),
		section: soulImprintSection.index,
		prop: "text",
	}, newHero);

	const soulImprintSkills = soulImprintData.parse.text['*'];
	// return soulImprintSkills;
	const $ = cheerio.load(soulImprintSkills);

	return extractSoulImprintSkill($);
}

function extractSoulImprintSkill($: cheerio.CheerioAPI) {
	const soulImprintSkills: SkillData[] = [];
	let currentCategory = '';

	const passiveSkill: string[] = [];

	// Find the Skills heading
	const skillsHeading = $('h2:has(span#Soul_Imprint)');

	// Find the first wikitable after the Skills heading
	const skillsTable = skillsHeading.nextAll('table.wikitable').first();

	skillsTable.find('tbody tr').each((index, row) => {
		const $row = $(row)
		const $cells = $row.find('td, th');

		if ($cells.length === 1 && $cells.attr('colspan') === '3') {
			currentCategory = $cells.text().trim();
			return;
		}

		if ($cells.filter('th[scope="col"]').length > 0) {
			return;
		}

		switch (currentCategory) {
			case 'MEMORY CORE EFFECT':
				passiveSkill.push($cells.length === 3 ? 'Passive' : 'Active');
				const description = $cells.last().text().trim();
				passiveSkill.push(description);
				if ($cells.length === 3) {
					soulImprintSkills.push({
						name: 'Passive',
						skillType: 'pass',
						description: passiveSkill.join('\n'),
						image: ''
					});
				}
				break;
			case 'BODY CORE EFFECT':
				if ($cells.length === 3) {
					const skillName = $cells.eq(1).find('b').first().text().trim();
					const description = $cells.last().text().trim();
					const $img = $cells.eq(1).find('img');
					let skillImage = $img.attr('data-src') || $img.attr('src') || '';
					skillImage = getImageString(skillImage);
					soulImprintSkills.push({
						name: skillName,
						skillType: 's1',
						description: description,
						image: skillImage
					});
				}
				if ($cells.length === 2) {
					const skillName = $cells.eq(0).find('b').first().text().trim();
					const description = $cells.last().text().trim();
					const $img = $cells.eq(0).find('img');
					let skillImage = $img.attr('data-src') || $img.attr('src') || '';
					skillImage = getImageString(skillImage);
					soulImprintSkills.push({
						name: skillName,
						skillType: 's2',
						description: description,
						image: skillImage
					});
				}
				break;
			case 'SOUL CORE EFFECT':
				if ($cells.length === 3) {
					const skillName = $cells.eq(1).find('b').first().text().trim();
					const description = $cells.last().text().trim();
					const $img = $cells.eq(1).find('img');
					let skillImage = $img.attr('data-src') || $img.attr('src') || '';
					skillImage = getImageString(skillImage);
					soulImprintSkills.push({
						name: skillName,
						skillType: 'cs',
						description: description,
						image: skillImage
					});
				}
		}

	});

	return soulImprintSkills;
}

function processSkillType(skillType: string) {
	switch (skillType.toLowerCase()) {
		case 'skill1':
			return 's1';
		case 'skill2':
			return 's2';
		case 'special':
			return 'ss';
		case 'passive':
			return 'pass';
		case 'chaser':
			return 'cs';
		default:
			return 'bonus';
	}
}

// New helper functions for getSkills
function extractFlatSkills($: cheerio.CheerioAPI) {
	const extractedSkills: SkillData[] = [];
	let currentCategory = '';
	// Find the Skills heading
	const skillsHeading = $('h2:has(span#Skills)');

	// Find the first wikitable after the Skills heading
	const skillsTable = skillsHeading.nextAll('table.wikitable').first();

	skillsTable.find('tbody tr').each((index, row) => {
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

	// Find the Skills heading
	const skillsHeading = $('h2:has(span#Skills)');

	// Find the first tabber after the Skills heading
	const skillsTabber = skillsHeading.nextAll('.tabber.wds-tabber').first();

	skillsTabber.find('.wds-tab__content').each((tabIndex, tabContent) => {
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
								upgradeType: 'lb',
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
							cooldown,
							upgrades: []
						};
					}
				} else if (currentSkill && skillDescription) {
					// This is an upgrade for the current skill
					currentSkill.upgrades?.push({
						upgradeType: $cells.eq(1).text().trim(),
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

function extractChaserSkill($: cheerio.CheerioAPI) {
	const chaserSkill: SkillData = {
		name: '',
		skillType: 'cs',
		description: '',
		pvpDescription: '',
		image: '',
		sp: 'N/A',
		cooldown: 'N/A',
		upgrades: [],
	};

	// Find the Chaser Skill heading
	const chaserSkillHeading = $('h3:has(span#Chaser_Skill)');

	// Find the first tabber after the Chaser Skill heading
	const chaserSkillTabber = chaserSkillHeading.nextAll('.tabber.wds-tabber').first();
	
	chaserSkillTabber.find('.wds-tab__content').each((tabIndex, tabContent) => {
		const isPvP = tabIndex === 1;
		$(tabContent).find('table.wikitable').each((_, table) => {
			let currentCategory = '';
			let additionalEffectImages = [] as string[];
			let upgradedImage = '';

			$(table).find('tbody tr').each((_, row) => {
				const $row = $(row);
				const $cells = $row.find('td, th');

				if ($cells.length === 1 && $cells.attr('colspan') === '4') {
					currentCategory = $cells.text().trim();
					return;
				}

				if ($cells.filter('th[scope="col"]').length > 0) {
					return;
				}

				switch (currentCategory) {
					case 'DEFAULT':
						chaserSkill.image = $row.find('td').eq(0).find('img').attr('data-src') || $row.find('td').eq(0).find('img').attr('src') || '';
						chaserSkill.image = getImageString(chaserSkill.image);
						chaserSkill.name = $row.find('td').eq(1).find('b').text().trim();
						if (isPvP) {
							chaserSkill.pvpDescription = $row.find('td').last().html() || '';
						} else {
							chaserSkill.description = $row.find('td').last().html() || '';
						}
						break;
					case 'UPGRADED':
						if ($cells.length === 4) {
							upgradedImage = $row.find('td').eq(0).find('img').attr('data-src') || $row.find('td').eq(0).find('img').attr('src') || '';
							return;
						}

						let code = $row.find('td').eq($cells.length === 4 ? 2 : 0).text().trim();
						if (code !== 'LVL 3') {
							return;
						}

						const upgradedDescription = $row.find('td').last().html() || '';

						chaserSkill.image = getImageString(upgradedImage) || '';
						if (isPvP) {
							chaserSkill.pvpDescription = upgradedDescription;
						} else {
							chaserSkill.description = upgradedDescription;
						}

						break;
					case 'ADDITIONAL EFFECT':
						if ($cells.length === 3) {
							additionalEffectImages = $row.find('td').eq(0).find('img').map((_, img) => {
								return getImageString($(img).attr('data-src') || $(img).attr('src') || '');
							}).get();
							return;
						}

						const description = $row.find('td').last().html() || '';

						if (isPvP) {
							const additionalEffectIndex = chaserSkill.upgrades?.findIndex(u => u.upgradeType === 'cs');
							if (additionalEffectIndex != undefined && additionalEffectIndex !== -1 && chaserSkill.upgrades) {
								chaserSkill.upgrades[additionalEffectIndex].pvpDescription = description;
							}
						} else {
							chaserSkill.upgrades?.push({
								upgradeType: 'csr',
								description,
								image: additionalEffectImages[additionalEffectImages.length - 1]
							});
						}
						break;
				}
			});
		});
	});

	return chaserSkill;
}

function extractFlatChaserSkill($: cheerio.CheerioAPI) {
	const chaserSkill: SkillData = {
		name: '',
		skillType: 'cs',
		description: '',
		pvpDescription: '',
		image: '',
		sp: 'N/A',
		cooldown: 'N/A',
		upgrades: [],
	};
	// Find the Chaser Skill heading
	const chaserSkillHeading = $('h2:has(span#Chaser_Skill)');

	// Find the first wikitable after the Chaser Skill heading
	const chaserSkillTable = chaserSkillHeading.nextAll('table.wikitable').first();

	let currentCategory = '';
	let additionalEffectImages = [] as string[];
	let upgradedImage = '';

	chaserSkillTable.find('tbody tr').each((_, row) => {
		const $row = $(row);
		const $cells = $row.find('td, th');

		if ($cells.length === 1 && $cells.attr('colspan')) {
			currentCategory = $cells.text().trim();
			return;
		}

		if ($cells.filter('th[scope="col"]').length > 0) {
			return;
		}

		switch (currentCategory) {
			case 'DEFAULT':
				chaserSkill.image = $row.find('td').eq(0).find('img').attr('data-src') || $row.find('td').eq(0).find('img').attr('src') || '';
				chaserSkill.image = getImageString(chaserSkill.image);
				chaserSkill.name = $row.find('td').eq(1).find('b').text().trim();
				chaserSkill.description = $row.find('td').last().html() || '';
				break;
			case 'UPGRADED':
				if ($cells.length === 4) {
					upgradedImage = $row.find('td').eq(0).find('img').attr('data-src') || $row.find('td').eq(0).find('img').attr('src') || '';
					return;
				}

				let code = $row.find('td').eq($cells.length === 4 ? 2 : 0).text().trim();
				if (code !== 'LVL 3') {
					return;
				}

				const upgradedDescription = $row.find('td').last().html() || '';
				chaserSkill.image = getImageString(upgradedImage) || '';
				chaserSkill.description = upgradedDescription;
				break;
			case 'ADDITIONAL EFFECT':
				if ($cells.length === 3) {
					additionalEffectImages = $row.find('td').eq(0).find('img').map((_, img) => {
						return getImageString($(img).attr('data-src') || $(img).attr('src') || '');
					}).get();
					return;
				}

				const description = $row.find('td').last().html() || '';
				chaserSkill.upgrades?.push({
					upgradeType: 'cs',
					description,
					image: additionalEffectImages[additionalEffectImages.length - 1]
				});
				break;
		}
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