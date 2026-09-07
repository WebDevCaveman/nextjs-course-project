const AnswerEdit = async ({ params }: RouteParams) => {
  const { id } = await params;
  return <div>Answer Edit {id}</div>;
};

export default AnswerEdit;
