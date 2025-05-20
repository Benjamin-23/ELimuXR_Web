import { createClient } from "@/utils/supabase/server";
import { FiLogOut } from "react-icons/fi";
import { useState, useEffect } from "react";
import { signOutAction } from "@/app/actions";

export default async function Logout() {
  const supabase = createClient();

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabaseClient = await supabase;
      const { data } = await supabaseClient.auth.getUser();
      setUser(data.user);
    };

    fetchUser();
  }, [supabase]);

  return (
    <div className="p-4 border-t mt-6">
      {user && (
        <button
          onClick={() => signOutAction()}
          className="flex items-center w-1/2 p-2 rounded-lg bg-primary hover:bg-primary"
        >
          <FiLogOut className="text-lg" />
          <span className="ml-3 font-medium ">Logout</span>
        </button>
      )}
    </div>
  );
}
