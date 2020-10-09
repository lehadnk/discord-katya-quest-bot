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

        if (msg.message.substr(0, 7) === '!первые') {
            let chunks = msg.message.split(' ');
            if (chunks.length !== 2) {
                return;
            }

            let question = parseInt(chunks[1]);
            if (question < 1 || question > 11) {
                return null;
            }

            return this.statisticsService.getFirstResponses(question);
        }

        return null;
    }
}