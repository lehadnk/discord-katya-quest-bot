import {DiscordControllerResponse} from "nergal";
import {DiscordMessage} from "nergal";
import GameService from "../Services/Game/GameService";
import User from "../Models/User";
import DirectMessageService from "../Services/DirectMessages/DirectMessageService";

export default class GameController {
    private gameService = new GameService();
    private dmService = new DirectMessageService();

    public async handle(msg: DiscordMessage, user: User): Promise<DiscordControllerResponse>
    {
        if (!await this.gameService.isActivePlayer(user)) {
            return new DiscordControllerResponse("Вы уже завершили игру. Спасибо за участие :heart:");
        }

        let question = await this.gameService.getCurrentQuestion(user);
        if (msg.message === '!вопрос') {
            return new DiscordControllerResponse(question.text);
        }

        if (msg.message === '!подсказонька') {
            return await this.gameService.doHint(user, question);
        }

        let answerStatus = await this.gameService.checkAnswer(user, question, msg.message);

        if (answerStatus.isCorrect) {
            if (answerStatus.message) {
                await this.dmService.sendDm(user.discord_user_id, answerStatus.message);
            }

            let nextQuestion = await this.gameService.getCurrentQuestion(user);
            if (!nextQuestion) {
                await this.gameService.completeGame(user);
                return new DiscordControllerResponse(question.complete_text);
            }

            return new DiscordControllerResponse(nextQuestion.text);
        }

        return new DiscordControllerResponse("Ответ неправильный");
    }
}