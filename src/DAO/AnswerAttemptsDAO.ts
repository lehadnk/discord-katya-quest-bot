import {AbstractDAO} from 'nergal';
import {IDbAdapter} from 'nergal';
import AnswerAttempt from "../Models/AnswerAttempt";

export default class AnswerAttemptsDAO extends AbstractDAO<AnswerAttempt> {
    fields: string[] = ['id', 'user_id', 'level', 'given_at', 'is_correct', 'answer'];
    table: string = 'answer_attempts';

    public constructor(db: IDbAdapter) {
        super(db, () => new AnswerAttempt());
    }

    public async getAnswersCount(level: number): Promise<number>
    {
        return parseInt(await this.db.value("SELECT count(id) FROM " + this.table + " WHERE level = ?1 AND is_correct = 1", {
            1: level,
        }));
    }
}