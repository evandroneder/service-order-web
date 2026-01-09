export interface User {
  id_user: number;
  name: string;
  username: string;
  role: "ADMIN" | "USER";
}
