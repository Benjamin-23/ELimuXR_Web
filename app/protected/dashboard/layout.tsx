import Sidebar from "@/components/side_bar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-8  w-screen">
      <div className=" w-[20%]">
        <Sidebar />
      </div>

      <div className=" mx-3">{children}</div>
    </div>
  );
}
