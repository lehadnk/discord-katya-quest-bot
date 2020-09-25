import User from "../../Models/User";
import TakenHintsDAO from "../../DAO/TakenHintsDAO";
import AppServiceContainer from "../../AppServiceContainer";
import Question from "../../Models/Question";
import TakenHint from "../../Models/TakenHint";
import AnswerAttemptsDAO from "../../DAO/AnswerAttemptsDAO";
import {DiscordControllerResponse} from "nergal";

export class HintService {
    takenHintsDao: TakenHintsDAO = new TakenHintsDAO(AppServiceContainer.db);
    answerAttemptsDao: AnswerAttemptsDAO = new AnswerAttemptsDAO(AppServiceContainer.db);

    public async doHint(user: User, question: Question): Promise<DiscordControllerResponse>
    {
        if (question.getHintsAmount() === 0) {
            return null;
        }

        let lastAnswer = await this.answerAttemptsDao.getLastCorrectAnswer(user);
        let lastAnswerTime = lastAnswer ? lastAnswer.given_at : user.started_at;
        let currentTime = Math.ceil(Date.now() / 1000);
        if (currentTime - lastAnswerTime < 600) {
            return new DiscordControllerResponse("Вы не можете взять подсказку в течении первых 10 минут после начала задания.");
        }

        let hint = await this.takenHintsDao.getCurrent(user);

        if (!hint) {
            hint = new TakenHint();
            hint.user_id = user.id;
            hint.level = user.level;
            hint.amount = 1;
            hint.penalty = question.penalty;
            await this.takenHintsDao.save(hint);
            return new DiscordControllerResponse(question.hint);
        }

        if (hint.amount >= question.getHintsAmount()) {
            return new DiscordControllerResponse(hint.amount === 1 ? question.hint : question.hint + '\n\n' + question.hint2);
        }

        if (currentTime - hint.taken_at < 600) {
            return new DiscordControllerResponse("Вы не можете взять подсказку в течении 10 минут после прошлой подсказки.");
        }

        hint.amount += 1;
        hint.penalty += question.penalty2;
        await this.takenHintsDao.save(hint);

        return new DiscordControllerResponse(question.hint2);
    }

    public async getTotalPenalty(user: User): Promise<number>
    {
        return await this.takenHintsDao.getTotalPenalty(user.id);
    }
}