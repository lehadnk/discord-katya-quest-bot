export default class Question {
    id: number;
    text: string;
    hint: string;
    answers: string;

    public getAnswers(): string[]
    {
        return JSON.parse(this.answers);
    }
}