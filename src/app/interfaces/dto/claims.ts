export interface Claims {
  sub: string;   // O e-mail do usuário
  exp: number;   // A data de expiração
  role: string;  // A role (ex: "ADMIN", "NUTRICIONISTA")
}