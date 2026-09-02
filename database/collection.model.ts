import { Schema, models, Types, model, Document, Model } from "mongoose";

export interface ICollection {
  author: Types.ObjectId;
  question: Types.ObjectId;
}

export interface ICollectionDoc extends ICollection, Document {}

const CollectionSchema = new Schema<ICollection>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    question: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
  },
  { timestamps: true }
);

// Ensure a user can only save a question once
CollectionSchema.index({ author: 1, question: 1 }, { unique: true });

const Collection: Model<ICollection> = models?.Collection || model<ICollection>("Collection", CollectionSchema);

export default Collection;
