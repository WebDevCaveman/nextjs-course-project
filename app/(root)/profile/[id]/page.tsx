import { auth } from "@/auth";
import { getUser } from "@/lib/actions/user.action";
import { notFound } from "next/navigation";
import ProfileHeader from "@/components/user/ProfileHeader";
import Stats from "@/components/user/Stats";
import ProfileTabs from "@/components/user/ProfileTabs";
import UserTags from "@/components/user/UserTags";

const Profile = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  if (!id) notFound();

  const { tab, page, pageSize } = await searchParams;

  // W ten sposob sprawdzamy czy user sprawdza swoj wlasny profil
  const loggedInUser = await auth();

  const { success, data, error } = await getUser({ userId: id });
  if (!success) return <div>{error?.message}</div>;

  const { user, totalQuestions, totalAnswers } = data!;

  return (
    <>
      <ProfileHeader user={user} isOwnProfile={loggedInUser?.user?.id === user._id} />
      <Stats
        totalQuestions={totalQuestions}
        totalAnswers={totalAnswers}
        badges={{ bronze: 0, silver: 0, gold: 0 }}
        reputationPoints={user.reputation || 0}
      />

      <div className="flex flex-col gap-10 lg:flex-row">
        <div className="min-w-0 flex-1">
          <ProfileTabs userId={user._id} tab={tab} page={Number(page) || 1} pageSize={Number(pageSize) || 10} />
        </div>

        <div className="lg:w-[330px] lg:shrink-0">
          <UserTags userId={user._id} />
        </div>
      </div>
    </>
  );
};

export default Profile;
