import {DiscordControllerResponse} from "nergal/src/DTO/DiscordControllerResponse";
import {DiscordMessage} from "nergal/src/DTO/DiscordMessage";

export default class AdminController {
    public async handle(msg: DiscordMessage): Promise<DiscordControllerResponse>
    {
        return new DiscordControllerResponse("Admin controller");
    }
}