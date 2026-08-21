import { flattenError, ZodError, type ZodType } from "zod";
import { UnauthorizedError, ValidationError } from "../http-errors";
import type { Session } from "next-auth";
import { auth } from "@/auth";
import dbConnect from "../mongoose";

// Korzystamy tu z generic type T poniewa nasze action moze przyjmowac rozne typy danych w zaleznosci od tego co chcemy zrobic. Na przyklad user data lub account data. Dlatego tez definiujemy typ ActionOptions<T>, ktory przyjmuje generic type T, aby moc okreslic jakie dane sa wymagane dla danej akcji. Dodatkowo, w tym typie mozemy okreslic czy dana akcja wymaga autoryzacji (authorize) oraz czy ma byc walidowana za pomoca schematu Zod (schema).
type ActionOptions<T> = {
  params?: T;
  schema?: ZodType<T>;
  authorize?: boolean;
};

//Ta funkcja wykonuje kilka waznych krokow:
// - Sprawdza czy podany schemat (schema) jest zgodny z danymi (params) i waliduje te dane.Jesli nie, zwraca ValidationError.
// - Jesli authorize jest ustawione na true, sprawdza czy uzytkownik jest zalogowany. Jesli nie, zwraca UnauthorizedError.
// - Laczy sie z baza danych za pomoca dbConnect().
// - Zwraca obiekt zawierajacy params i session (jesli authorize jest true).
const action = async <T>({ params, schema, authorize = false }: ActionOptions<T>) => {
  if (schema) {
    try {
      schema.parse(params);
    } catch (error) {
      if (error instanceof ZodError) {
        return new ValidationError(flattenError(error).fieldErrors as Record<string, string[]>);
      } else {
        return new Error("Schema validation failed");
      }
    }
  }

  let session: Session | null = null;

  if (authorize) {
    session = await auth();

    if (!session) {
      return new UnauthorizedError();
    }
  }

  await dbConnect();

  return { params, session };
};

export default action;
