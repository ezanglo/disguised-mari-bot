import supabase from "../supabase";

export const getHeroes = async () => {
  try {
    let { data, error } = await supabase.from("hero").select("*");
    return data;
  } catch (error) {
    console.log("error");
  }
};
