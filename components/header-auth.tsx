import { signOutAction } from "@/app/actions";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";
import { Moon, Sun, User } from "lucide-react";
import { ThemeSwitcher } from "./theme-switcher";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userData = null;
  let userError = null;

  const { data, error } = await supabase
    .from("users")
    .select("full_name, avatar_url")
    .eq("email", user?.email)
    .single();

  userData = data;
  userError = error;

  if (userError) {
    console.error("Error fetching user details:", userError);
  }

  if (!hasEnvVars) {
    return (
      <>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div>
            <Badge
              variant={"default"}
              className="font-normal pointer-events-none text-center text-xs sm:text-sm"
            >
              Please update .env.local file with anon key and url
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              asChild
              size="sm"
              variant={"outline"}
              disabled
              className="opacity-75 cursor-none pointer-events-none"
            >
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant={"default"}
              disabled
              className="opacity-75 cursor-none pointer-events-none"
            >
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }
  return user ? (
    <div className="flex w-full flex-col sm:flex-row gap-4 justify-end items-center">
      <ThemeSwitcher />
      <div className="flex items-center gap-2">
        <User className="h-5 w-5" />
        <div className="flex w-8 h-8 items-center justify-center rounded-full">
          {userData?.avatar_url ? (
            <img
              src={userData?.avatar_url || "/placeholder.svg"}
              alt={userData?.full_name || ""}
              className="rounded-full w-8 h-8"
            />
          ) : (
            <div className="text-xl font-bold text-white">
              {userData?.full_name}
            </div>
          )}
        </div>
      </div>
      <form action={signOutAction}>
        <Button type="submit" variant={"outline"} size="sm">
          Sign out
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2 items-center">
      <ThemeSwitcher />
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
