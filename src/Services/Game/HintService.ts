import User from "../../Models/User";
import TakenHintsDAO from "../../DAO/TakenHintsDAO";
import AppServiceContainer from "../../AppServiceContainer";
import Question from "../../Models/Question";
import TakenHint from "../../Models/TakenHint";

export class HintService {
    takenHintsDao: TakenHintsDAO = new TakenHintsDAO(AppServiceContainer.db);

    public async doHint(user: User, question: Question): Promise<string>
    {
        if (question.getHintsAmount() === 0) {
            return null;
        }

        let hint = await this.takenHintsDao.getCurrent(user);

        if (!hint) {
            hint = new TakenHint();
            hint.user_id = user.id;
            hint.level = user.level;
            hint.amount = 1;
            hint.penalty = question.penalty;
            await this.takenHintsDao.save(hint);
            return question.hint;
        }

        if (hint.amount >= question.getHintsAmount()) {
            return hint.amount === 1 ? question.hint : question.hint + '\n\n' + question.hint2;
        }

        hint.amount += 1;
        hint.penalty += question.penalty2;
        await this.takenHintsDao.save(hint);

        return question.hint2;
    }

    public async getTotalPenalty(user: User): Promise<number>
    {
        return await this.takenHintsDao.getTotalPenalty(user.id);
    }
}