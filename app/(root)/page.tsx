import { auth } from "@/auth";

const Home = async () => {
  const session = await auth();
  return (
    <div>
      <h1 className="text-3xl font-bold">Welcome to Next.js!</h1>
      {session ? (
        <p className="mt-4 text-lg">You are logged in as {session.user?.email}</p>
      ) : (
        <p className="mt-4 text-lg">You are not logged in.</p>
      )}
    </div>
  );
};

export default Home;
