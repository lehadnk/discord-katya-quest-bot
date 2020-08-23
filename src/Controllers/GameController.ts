import {DiscordControllerResponse} from "nergal/src/DTO/DiscordControllerResponse";
import {DiscordMessage} from "nergal/src/DTO/DiscordMessage";
import GameService from "../Services/Game/GameService";
import User from "../Models/User";
import UsersDAO from "../DAO/UsersDAO";
import AppServiceContainer from "../AppServiceContainer";
import DirectMessageService from "../Services/DirectMessages/DirectMessageService";

export default class GameController {
    private gameService = new GameService();
    private userDao = new UsersDAO(AppServiceContainer.db);
    private dmService = new DirectMessageService();

    public async handle(msg: DiscordMessage, user: User): Promise<DiscordControllerResponse>
    {
        if (!await this.gameService.isActivePlayer(user)) {
            return new DiscordControllerResponse("You finished the game");
        }

        if (msg.message === '!вопрос') {
            let question = await this.gameService.getCurrentQuestion(user);
            return new DiscordControllerResponse(question.text);
        }

        let answerStatus = await this.gameService.checkAnswer(user, msg.message);

        if (answerStatus.isCorrect) {
            if (answerStatus.message) {
                await this.dmService.sendDm(user.discord_user_id, answerStatus.message);
            }

            let question = await this.gameService.getCurrentQuestion(user);
            if (!question) {
                return null;
            }

            return new DiscordControllerResponse(question.text);
        }

        return new DiscordControllerResponse("Answer was not right");
    }
}