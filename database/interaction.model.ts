import { Schema, models, model, Types, Document, Model } from "mongoose";

export const INTERACTIONS = ["view", "upvote", "downvote", "bookmark", "post", "edit", "delete", "search"] as const;

export interface IInteraction {
  user: Types.ObjectId;
  action: (typeof INTERACTIONS)[number];
  actionId: Types.ObjectId;
  actionType: "question" | "answer";
}

export interface IInteractionDoc extends IInteraction, Document {}

const InteractionSchema = new Schema<IInteraction>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: {
      type: String,
      enum: INTERACTIONS,
      required: true,
    },
    actionId: { type: Schema.Types.ObjectId, required: true }, // 'questionId', 'answerId',
    actionType: { type: String, enum: ["question", "answer"], required: true },
  },
  { timestamps: true }
);

const Interaction: Model<IInteraction> = models?.Interaction || model<IInteraction>("Interaction", InteractionSchema);

export default Interaction;
