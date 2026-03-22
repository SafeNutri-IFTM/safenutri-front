export class UserInput {
  nome: string | undefined;
  email: string | undefined;
  senha: string | undefined;
  dt_nascimento: string | undefined;
  generoId: number | undefined;
  roleId: number | undefined;
  restricoesIds?: number[];

  constructor(data: any) {
    this.nome = data.nome;
    this.email = data.email;
    this.senha = data.senha;
    this.dt_nascimento = data.dt_nascimento;
    this.generoId = data.generoId;
    this.roleId = data.roleId;
    
    // Específico do Paciente
    this.restricoesIds = data.restricoesIds;
  }
}