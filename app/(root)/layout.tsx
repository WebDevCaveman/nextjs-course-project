import LeftSidebar from "@/components/navigation/LeftSidebar";
import Navbar from "@/components/navigation/navbar";
import RightSidebar from "@/components/navigation/RightSidebar";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <Navbar />
      <div className="flex">
        <LeftSidebar />
        <div className="min-w-0 flex-1">{children}</div>
        <RightSidebar />
      </div>
    </main>
  );
};

export default RootLayout;
