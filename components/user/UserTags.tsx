import { getUserTags } from "@/lib/actions/user.action";
import { DataRenderer } from "../DataRenderer";
import TagList from "../tag-list/TagList";

const UserTags = async ({ userId }: { userId: string }) => {
  const { success, data, error } = await getUserTags({ userId });
  const tags = data?.tags || [];
  const topTags = tags.map((tag) => ({ _id: tag._id, name: tag.name, questions: tag.count }));

  return (
    <DataRenderer
      success={success}
      data={topTags}
      error={error}
      empty={{ title: "No tags found", message: "This user has not used any tags yet." }}
      render={(topTags) => (
        <section className="flex flex-col gap-4">
          <h3>Top Tags</h3>
          <TagList tags={topTags} />
        </section>
      )}
    />
  );
};

export default UserTags;
