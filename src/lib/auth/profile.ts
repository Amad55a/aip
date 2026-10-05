import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

export type ProfileFields = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
};

export function profileFieldsFromUser(user: User): ProfileFields {
  const meta = user.user_metadata ?? {};

  const fullName =
    (typeof meta.full_name === "string" && meta.full_name.trim()) ||
    (typeof meta.name === "string" && meta.name.trim()) ||
    (typeof meta.user_name === "string" && meta.user_name.trim()) ||
    (user.email ? user.email.split("@")[0] : null);

  const avatarUrl =
    (typeof meta.avatar_url === "string" && meta.avatar_url.trim()) ||
    (typeof meta.picture === "string" && meta.picture.trim()) ||
    null;

  return {
    id: user.id,
    full_name: fullName,
    avatar_url: avatarUrl,
  };
}

/**
 * Safe upsert keyed by auth.users.id.
 * Missing avatars must never fail authentication.
 */
export async function upsertOwnProfile(
  supabase: SupabaseClient<Database>,
  user: User
) {
  const fields = profileFieldsFromUser(user);

  const { error } = await supabase.from("profiles").upsert(
    {
      id: fields.id,
      full_name: fields.full_name,
      avatar_url: fields.avatar_url,
    },
    { onConflict: "id", ignoreDuplicates: true }
  );

  if (error) {
    console.error("Profile upsert failed:", error.message);
  }
}
