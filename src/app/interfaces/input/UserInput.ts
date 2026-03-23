export class UserInput {
  genero: number;
  role: number;
  nome: string;
  email: string;
  senha: string;
  dtNascimento: string;
  restricoes: number[];

  constructor(user: any) {
    this.genero = user.genero;
    this.role = user.role;
    this.nome = user.nome;
    this.email = user.email;
    this.senha = user.senha;
    this.dtNascimento = user.dtNascimento;
    this.restricoes = user.restricoes;
  }
}