import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ROUTES from "@/constants/routes";
import Link from "next/link";
import UserAnswers from "./UserAnswers";
import UserQuestions from "./UserQuestions";

const ProfileTabs = ({ userId, tab = "top-posts", page, pageSize }: ProfileTabsParams) => {
  // value, nie defaultValue: zakladke wybiera URL. defaultValue czyta sie raz przy
  // montowaniu, a instancja przezywa nawigacje - panel zostawal wtedy pusty.
  return (
    <Tabs value={tab} className="gap-10">
      <TabsList variant="segmented">
        <TabsTrigger value="top-posts" asChild>
          <Link href={`${ROUTES.PROFILE(userId)}?tab=top-posts`}>Top Posts</Link>
        </TabsTrigger>
        <TabsTrigger value="answers" asChild>
          <Link href={`${ROUTES.PROFILE(userId)}?tab=answers`}>Answers</Link>
        </TabsTrigger>
      </TabsList>

      <TabsContent value={tab}>
        {tab === "top-posts" ? (
          <UserQuestions userId={userId} page={page} pageSize={pageSize} />
        ) : (
          <UserAnswers userId={userId} page={page} pageSize={pageSize} />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
