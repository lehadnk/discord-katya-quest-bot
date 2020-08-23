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
}