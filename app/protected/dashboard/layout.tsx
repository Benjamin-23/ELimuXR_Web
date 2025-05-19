import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import Sidebar from "@/components/side_bar";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=" w-screen">
      <div className="flex flex-col gap-8">
        <nav className="w-full flex justify-end border-b border-b-foreground/10 h-16">
          <div className="flex  p-3 px-5 text-sm justify-end">
            {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
          </div>
        </nav>
        <div className="flex gap-8 ">
          <div className="w-[20%]">
            <Sidebar />
          </div>

          <div className=" mx-3 w-[80%]">{children}</div>
        </div>
      </div>
    </div>
  );
}
