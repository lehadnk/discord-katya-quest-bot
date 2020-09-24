export default class Question {
    id: number;
    text: string;
    hint: string;
    hint2: string;
    answers: string;
    penalty: number;
    penalty2: number;
    complete_text: string;

    public getAnswers(): string[]
    {
        return JSON.parse(this.answers);
    }

    public getHintsAmount(): number
    {
        let amount = 0;
        if (this.hint) {
            amount += 1;
        }
        if (this.hint2) {
            amount += 1;
        }

        return amount;
    }
}