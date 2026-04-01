import { UserInput } from './UserInput';

export class NutricionistaInput {
    userInput: UserInput;
    CRN: string;
    inscricao: string;

    constructor(nutri: any) {

        this.userInput = new UserInput(nutri.userInput || {}); // passando os dados aninhados
        this.CRN = nutri.CRN;
        this.inscricao = nutri.inscricao;
    }
}