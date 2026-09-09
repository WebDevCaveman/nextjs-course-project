import { auth } from "@/auth";
import ProfileForm from "@/components/forms/ProfileForm";
import ROUTES from "@/constants/routes";
import { getUser } from "@/lib/actions/user.action";
import { notFound, redirect } from "next/navigation";

const ProfileEdit = async () => {
  const session = await auth();
  if (!session?.user?.id) redirect(ROUTES.SIGN_IN);

  const { data, success } = await getUser({ userId: session.user.id });
  if (!success || !data) notFound();

  return (
    <>
      <h1>Edit Profile</h1>
      <ProfileForm user={data.user} />
    </>
  );
};

export default ProfileEdit;
