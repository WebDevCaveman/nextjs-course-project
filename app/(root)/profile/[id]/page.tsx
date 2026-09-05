import { auth } from "@/auth";
import { getUser } from "@/lib/actions/user.action";
import { notFound } from "next/navigation";
import ProfileHeader from "@/components/user/ProfileHeader";
import Stats from "@/components/user/Stats";

const Profile = async ({ params }: RouteParams) => {
  const { id } = await params;
  if (!id) notFound();

  // W ten sposob sprawdzamy czy user sprawdza swoj wlasny profil
  const loggedInUser = await auth();

  const { success, data, error } = await getUser({ userId: id });
  if (!success) return <div>{error?.message}</div>;

  const { user, totalQuestions, totalAnswers } = data!;

  return (
    <>
      <ProfileHeader user={user} isOwnProfile={loggedInUser?.user?.id === user._id} />
      <Stats totalQuestions={totalQuestions} totalAnswers={totalAnswers} badges={{ bronze: 0, silver: 0, gold: 0 }} />
    </>
  );
};

export default Profile;
