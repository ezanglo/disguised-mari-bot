const BASE = '/';

const ADMIN = {
	BASE: '/admin',
	DASHBOARD: {
		BASE: '/admin/dashboard',
	},
	HEROES: {
		BASE: '/admin/heroes',
		ADD: '/admin/heroes/add',
		HERO: (heroCode: string) => `/admin/heroes/${heroCode}`,
	},
	SKILLS: {
		BASE: '/admin/skills',
	},
	PETS: {
		BASE: '/admin/pets',
	},
	MONSTERS: {
		BASE: '/admin/monsters',
	},
	EQUIPS: {
		BASE: '/admin/equips',
	},
	CONTENTS: {
		BASE: '/admin/contents',
	},
	LINEUPS: {
		BASE: '/admin/lineups',
	},
	TRAITS: {
		BASE: '/admin/traits',
	},
	RESOURCES: {
		BASE: '/admin/resources',
	},
	SETTINGS: {
		BASE: '/admin/settings',
	},
}

const LINEUPS = {
	BASE: '/lineups',
	CREATE: '/lineups/create',
}

const PROFILE = {
	USER: '/profile',
	BASE: (username: string) => `/${username}`,
}

export const ROUTES = {
	BASE,
	PROFILE,
	ADMIN,
	LINEUPS
}