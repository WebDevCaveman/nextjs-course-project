import { Schema, models, Types, model, Document, Model } from "mongoose";

export interface ITagQuestion {
  question: Types.ObjectId;
  tag: Types.ObjectId;
}

export interface ITagQuestionDoc extends ITagQuestion, Document {}

const TagQuestionSchema = new Schema<ITagQuestion>(
  {
    question: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    tag: {
      type: Schema.Types.ObjectId,
      ref: "Tag",
      required: true,
    },
  },
  { timestamps: true }
);

const TagQuestion: Model<ITagQuestion> = models?.TagQuestion || model<ITagQuestion>("TagQuestion", TagQuestionSchema);

export default TagQuestion;
