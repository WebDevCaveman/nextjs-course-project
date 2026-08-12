import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";

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

      <form
        className="mt-6"
        action={async () => {
          "use server";
          await signOut({ redirectTo: ROUTES.SIGN_IN });
        }}
      >
        <Button variant="outline" type="submit">
          Logout
        </Button>
      </form>
    </div>
  );
};

export default Home;
