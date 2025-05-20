import Hero from "@/components/hero";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
// import { useEffect } from "react";

export default async function Home() {
  redirect("/dashboard");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/dashboard");
  } else {
    return redirect("/protected");
  }
}
