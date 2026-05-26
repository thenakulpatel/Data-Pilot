import { supabase }
from "@/lib/supabase";

export async function getUser(
  accessToken: string
) {

  const { data, error } =
    await supabase.auth.getUser(
      accessToken
    );

  if (error || !data.user) {
    return null;
  }

  return data.user;
}