import {AbstractDAO} from 'nergal';
import {IDbAdapter} from 'nergal';
import Question from "../Models/Question";

export default class QuestionsDAO extends AbstractDAO<Question> {
    fields: string[] = ['text', 'hint', 'answers', 'complete_text', 'hint2', 'penalty', 'penalty2'];
    table: string = 'questions';

    public constructor(db: IDbAdapter) {
        super(db, () => new Question);
    }
}