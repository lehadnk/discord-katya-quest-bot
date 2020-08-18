import {DiscordControllerResponse} from "nergal/src/DTO/DiscordControllerResponse";
import {DiscordMessage} from "nergal/src/DTO/DiscordMessage";
import GameService from "../Services/Game/GameService";
import User from "../Models/User";

export default class GameController {
    private gameService = new GameService();

    public async handle(msg: DiscordMessage, user: User): Promise<DiscordControllerResponse>
    {
        console.log(await this.gameService.getNextQuestion(user));
        return new DiscordControllerResponse("Game controller", false);
    }
}