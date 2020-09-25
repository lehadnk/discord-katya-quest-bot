import {AbstractDAO} from 'nergal';
import {IDbAdapter} from 'nergal';
import AnswerAttempt from "../Models/AnswerAttempt";
import User from "../Models/User";

export default class AnswerAttemptsDAO extends AbstractDAO<AnswerAttempt> {
    fields: string[] = ['id', 'user_id', 'level', 'given_at', 'is_correct', 'answer'];
    table: string = 'answer_attempts';

    public constructor(db: IDbAdapter) {
        super(db, () => new AnswerAttempt());
    }

    public async getCorrectAnswersCount(level: number): Promise<number>
    {
        return parseInt(await this.db.value("SELECT count(id) FROM " + this.table + " WHERE level = ?1 AND is_correct = 1", {
            1: level,
        }));
    }

    public async getLastCorrectAnswer(user: User): Promise<AnswerAttempt>
    {
        let data = await this.db.one("SELECT * FROM answer_attempts WHERE is_correct = true AND user_id = ?1 ORDER BY given_at DESC LIMIT 1", {
            1: user.id,
        });

        if (!data) {
            return null;
        }

        return this.populate(data);
    }
}