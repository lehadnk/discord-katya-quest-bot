import {DiscordControllerResponse} from "nergal/src/DTO/DiscordControllerResponse";
import {DiscordMessage} from "nergal/src/DTO/DiscordMessage";
import GameService from "../Services/Game/GameService";
import User from "../Models/User";
import UsersDAO from "../DAO/UsersDAO";
import AppServiceContainer from "../AppServiceContainer";

export default class GameController {
    private gameService = new GameService();
    private userDao = new UsersDAO(AppServiceContainer.db);

    public async handle(msg: DiscordMessage, user: User): Promise<DiscordControllerResponse>
    {
        if (msg.message === '!вопрос') {
            let question = await this.gameService.getCurrentQuestion(user);
            return new DiscordControllerResponse(question.text, false);
        }

        if (await this.gameService.checkAnswer(user, msg.message)) {
            await this.userDao.advanceLevel(user);
            let question = await this.gameService.getCurrentQuestion(user);

            if (!question) {
                return new DiscordControllerResponse("You are the winner", false);
            }

            return new DiscordControllerResponse(question.text, false);
        }
        console.log('no answer');

        return new DiscordControllerResponse("Answer was not right", false);
    }
}