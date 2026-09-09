import { Schema, models, model, Types, Document, Model } from "mongoose";
import { INTERACTIONS } from "@/constants/interactions";

export interface IInteraction {
  user: Types.ObjectId;
  action: (typeof INTERACTIONS)[number];
  actionId: Types.ObjectId;
  actionType: "question" | "answer";
  query?: string;
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
    query: { type: String },
  },
  { timestamps: true }
);

InteractionSchema.index({ user: 1, action: 1, actionId: 1 }, { unique: true });

const Interaction: Model<IInteraction> = models?.Interaction || model<IInteraction>("Interaction", InteractionSchema);

export default Interaction;
