import { auth } from "@/auth";
import { getUser } from "@/lib/actions/user.action";
import { notFound } from "next/navigation";
import ProfileHeader from "@/components/user/ProfileHeader";

const Profile = async ({ params }: RouteParams) => {
  const { id } = await params;
  if (!id) notFound();

  // W ten sposob sprawdzamy czy user sprawdza swoj wlasny profil
  const loggedInUser = await auth();

  const { success, data, error } = await getUser({ userId: id });
  if (!success) return <div>{error?.message}</div>;

  const { user, totalQuestions, totalAnswers } = data!;

  return (
    <div>
      <ProfileHeader user={user} isOwnProfile={loggedInUser?.user?.id === user._id} />
    </div>
  );
};

export default Profile;
