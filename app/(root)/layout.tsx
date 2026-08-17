import LeftSidebar from "@/components/navigation/LeftSidebar";
import Navbar from "@/components/navigation/navbar";
import RightSidebar from "@/components/navigation/RightSidebar";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <div className="flex">
        <LeftSidebar />
        <main className="mx-auto flex min-w-0 max-w-[1100px] flex-1 flex-col gap-10 px-[30px] py-10">
          {children}
        </main>
        <RightSidebar />
      </div>
    </>
  );
};

export default RootLayout;
