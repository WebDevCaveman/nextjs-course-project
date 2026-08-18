import { Schema, models, Types, model, Document } from "mongoose";

const PROVIDERS = ["email", "google", "github"] as const;

export interface IAccount {
  userId: Types.ObjectId;
  name: string;
  image?: string;
  password?: string;
  provider: (typeof PROVIDERS)[number];
  providerAccountId: string;
}

// Musimy dodać interfejs IAccountDoc, który rozszerza IAccount i Document, aby móc korzystać z metod Mongoose na dokumentach konta. Czyli np. odwolac sie do metody save() na dokumencie konta lub do _id, createdAt, updatedAt.
export interface IAccountDoc extends IAccount, Document {}

const AccountSchema = new Schema<IAccount>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    password: {
      type: String,
    },
    provider: {
      type: String,
      enum: PROVIDERS,
      required: true,
    },
    providerAccountId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Account = models?.Account || model<IAccount>("Account", AccountSchema);

export default Account;
