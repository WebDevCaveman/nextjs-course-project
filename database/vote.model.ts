import { Schema, models, model, Types, Document, Model } from "mongoose";

// W tym przypadku mamy troche inne podejscie ni w normalnych bazach danych, bo tutaj "id" jest referencja do pytania lub odpowiedzi - czyli moze wskazywać na rozne kolekcje w bazie danych. Dlatego mamy dodatkowe pole "type", które określa, czy głos dotyczy pytania czy odpowiedzi.

export interface IVote {
  author: Types.ObjectId;
  id: Types.ObjectId;
  type: "question" | "answer";
  voteType: "upvote" | "downvote";
}
export interface IVoteDoc extends IVote, Document {}

const VoteSchema = new Schema<IVote>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    id: {
      type: Schema.Types.ObjectId, // 'questionId', 'answerId'
      required: true,
    },
    type: {
      type: String,
      enum: ["question", "answer"],
      required: true,
    },
    voteType: {
      type: String,
      enum: ["upvote", "downvote"],
      required: true,
    },
  },
  { timestamps: true }
);

// Ensure a user can only vote once per target (question/answer)
VoteSchema.index({ author: 1, id: 1, type: 1 }, { unique: true });

const Vote: Model<IVote> = models?.Vote || model<IVote>("Vote", VoteSchema);

export default Vote;
