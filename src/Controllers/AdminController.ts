import {DiscordControllerResponse} from "nergal";
import {DiscordMessage} from "nergal";

export default class AdminController {
    public async handle(msg: DiscordMessage): Promise<DiscordControllerResponse>
    {
        return new DiscordControllerResponse("Admin controller");
    }
}