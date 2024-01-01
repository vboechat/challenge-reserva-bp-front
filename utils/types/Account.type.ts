export interface AccountEntity {
  id: string;
  username: string;
  email: string;
  role: "CLIENT" | "BROKER";
  createdAt: string;
  updatedAt: string;
}
