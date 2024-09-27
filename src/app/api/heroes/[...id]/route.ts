import { getDetails, getGallery, getHeroIcon, getSkills } from '@/lib/wiki-helper';

export const dynamic = 'force-static'

async function getHeroDetails(hero: string[], newHero: boolean = false) {
  try {
    const { title, details } = await getDetails(hero, newHero);
    const gallery = await getGallery(hero, newHero);
    const skills = await getSkills(hero, newHero);

    let icon = gallery['icons']?.find((icon: any) => icon.type === 'Soul Imprint')?.image || '';
    if (!icon) {
      icon = gallery['icons']?.reverse().find((icon: any) => icon.type.includes('icon'))?.image || '';
    }

    return {
      name: title?.[0],
      koreanName: title?.[1],
      image: icon,
      details,
      skills,
      gallery
    }
  } catch (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage === 'new-hero') {
      return getHeroDetails(hero, true);
    }
    throw new Error(errorMessage);
  }
}

export async function GET(request: Request, { params }: { params: { id: string[] } }) {

  try {

    const hero = params.id;

    const heroDetails = await getHeroDetails(hero);

    return Response.json(heroDetails);
  } catch (error) {

    const errorMessage = (error as Error).message;

    if (errorMessage === 'not-found') {
      return Response.json({ message: 'Hero not found' }, { status: 404 })
    }

    console.error(error);
    return Response.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}