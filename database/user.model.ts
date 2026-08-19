import { Schema, models, model, Document } from "mongoose";

// Poniewaz mongoose wspiera TS to najpierw trzeba stworzyć interfejs, który będzie reprezentował strukturę dokumentu w kolekcji "users". Interfejs ten będzie używany do typowania danych w aplikacji, co pozwoli na lepszą kontrolę nad danymi i uniknięcie błędów typów.
export interface IUser {
  name: string;
  username: string;
  email: string;
  bio?: string;
  image?: string;
  location?: string;
  portfolio?: string;
  reputation?: number;
}

export interface IUserDoc extends IUser, Document {}

// Nastepnie tworzymy schemat mongoose, który definiuje strukturę dokumentu w kolekcji "users". Schemat ten będzie używany do walidacji danych przed zapisaniem ich w bazie danych. W schemacie możemy określić typy danych, wymagane pola, unikalność pól itp.
const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    bio: {
      type: String,
    },
    image: {
      type: String,
    },
    location: {
      type: String,
    },
    portfolio: {
      type: String,
    },
    reputation: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Tworzymy model mongoose na podstawie schematu. Model ten będzie używany do interakcji z kolekcją "users" w bazie danych. Model pozwala na tworzenie, odczytywanie, aktualizowanie i usuwanie dokumentów w kolekcji. Tu używamy warunku, aby sprawdzić, czy model już istnieje (co jest przydatne w środowisku deweloperskim z hot reloadingiem), jeśli nie, tworzymy nowy model.
const User = models?.User || model<IUser>("User", UserSchema);

export default User;
