// Tworzymy ten plik po to, by ułatwic sobie zycie i zamiast kazdorazowo wywoływac nasz fetchHandler i przekazywać do niego urli i opcje mozemy stworzyc rozwiazanie, gdzie wystarczy, e bedziemy mogli np. wykorzystać api.users.getAll() i analogicznie utworzyc sobie metody, ktore obsluza nam cala logike związaną z fetchowaniem danych. W tym pliku tworzymy obiekt api, który zawiera metody do obsługi różnych endpointów API. Każda metoda korzysta z funkcji fetchHandler, aby wykonać żądanie HTTP i zwrócić odpowiedź w ustandaryzowany sposób.
import { IUser } from "@/database/user.model";
import { IAccount } from "@/database/account.model";
import { fetchHandler } from "./handlers/fetch";

// To rozwiazanie sprawi, ze na produkcji bedziemy mogli korzystać z naszego API, a w przypadku braku zmiennej środowiskowej NEXT_PUBLIC_API_BASE_URL, domyślnie zostanie użyty adres http://localhost:3000/api. Co oznacza, ze nie bedziemy musieli recznie zmieniac adresu API w kodzie, a jedynie ustawic odpowiednia zmienna środowiskowa w pliku .env.production lub w konfiguracji serwera. Dzieki temu nasze aplikacje beda bardziej elastyczne i łatwiejsze do wdrożenia w różnych środowiskach.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

export const api = {
  users: {
    getAll: () => fetchHandler(`${API_BASE_URL}/users`),
    getById: (id: string) => fetchHandler(`${API_BASE_URL}/users/${id}`),
    getByEmail: (email: string) =>
      fetchHandler(`${API_BASE_URL}/users/email`, {
        method: "POST",
        body: JSON.stringify({ email }),
      }),
    create: (userData: IUser) =>
      fetchHandler(`${API_BASE_URL}/users`, {
        method: "POST",
        body: JSON.stringify(userData),
      }),
    update: (id: string, userData: Partial<IUser>) =>
      fetchHandler(`${API_BASE_URL}/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(userData),
      }),
    delete: (id: string) =>
      fetchHandler(`${API_BASE_URL}/users/${id}`, {
        method: "DELETE",
      }),
  },
  accounts: {
    getAll: () => fetchHandler(`${API_BASE_URL}/accounts`),
    getById: (id: string) => fetchHandler(`${API_BASE_URL}/accounts/${id}`),
    getByProvider: (providerAccountId: string) =>
      fetchHandler(`${API_BASE_URL}/accounts/provider/`, {
        method: "POST",
        body: JSON.stringify({ providerAccountId }),
      }),
    create: (accountData: IAccount) =>
      fetchHandler(`${API_BASE_URL}/accounts`, {
        method: "POST",
        body: JSON.stringify(accountData),
      }),
    update: (id: string, accountData: Partial<IAccount>) =>
      fetchHandler(`${API_BASE_URL}/accounts/${id}`, {
        method: "PUT",
        body: JSON.stringify(accountData),
      }),
    delete: (id: string) =>
      fetchHandler(`${API_BASE_URL}/accounts/${id}`, {
        method: "DELETE",
      }),
  },
};
