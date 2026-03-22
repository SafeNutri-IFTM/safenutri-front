export class NutriInput {
    nome: string | undefined;
    email: string | undefined;
    senha: string | undefined;
    dt_nascimento: string | undefined;
    generoId: number | undefined;
    roleId: number | undefined;
    crn: string | undefined;
    descPerfil?: string;
    caminhoFoto?: string;

    constructor(data: any) {
        this.nome = data.nome;
        this.email = data.email;
        this.senha = data.senha;
        this.dt_nascimento = data.dt_nascimento;
        this.generoId = data.generoId;
        this.roleId = data.roleId;

        // Específico do Nutricionista
        this.crn = data.crn;
        this.descPerfil = data.descPerfil;
        this.caminhoFoto = data.caminhoFoto;
    }
}