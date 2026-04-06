export class ReceitaInput {
  tipoReceitaId!: number;
  titulo!: string;
  descricao!: string;
  tempoPreparo!: string;
  porcao!: number;
  calorias!: number;
  imagem!: string;
  restricoes: number[];



  constructor(receita: any) {
    this.tipoReceitaId = receita.tipoReceitaId,
    this.titulo = receita.titulo,
    this.descricao = receita.descricao,
    this.tempoPreparo = receita.tempoPreparo,
    this.porcao = receita.porcao,
    this.calorias = receita.calorias,
    this.imagem = receita.imagem,
    this.restricoes = receita.restricoes
  }
}
