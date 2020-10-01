import {DiscordControllerResponse} from "nergal";
import {DiscordMessage} from "nergal";
import {StatisticsService} from "../Services/Game/StatisticsService";

export default class PublicController {
    private statisticsService = new StatisticsService();

    public async handle(msg: DiscordMessage): Promise<DiscordControllerResponse>
    {
        if (msg.message === '!лидеры') {
            return this.statisticsService.getLeaderboard();
        }

        return null;
    }
}