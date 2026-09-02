import LeftSidebar from "@/components/navigation/LeftSidebar";
import Navbar from "@/components/navigation/navbar";
import RightSidebar from "@/components/navigation/RightSidebar";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <div className="flex">
        <LeftSidebar />
        <main className="flex min-w-0 flex-1 flex-col px-[30px] py-10">
          <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-10">{children}</div>
        </main>
        <RightSidebar />
      </div>
    </>
  );
};

export default RootLayout;
