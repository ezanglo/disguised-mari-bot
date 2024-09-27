import { getHeroes } from "@/lib/wiki-helper";

export async function GET() {

  try {
    const SR = await getHeroes('SS');
    const S = await getHeroes('S');
    const A = await getHeroes('A');
    const T = await getHeroes('T');

    return Response.json({ SR, S, A, T });
  } catch (error) {
    const errorMessage = (error as Error).message;

    if (errorMessage === 'not-found') {
      return Response.json({ message: 'Not found' }, { status: 404 })
    }

    console.log(error);
    return Response.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}