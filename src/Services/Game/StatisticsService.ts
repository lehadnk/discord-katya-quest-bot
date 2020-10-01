import {DiscordControllerResponse, IDbAdapter} from "nergal";
import AppServiceContainer from "../../AppServiceContainer";
import GameService from "./GameService";
import UsersDAO from "../../DAO/UsersDAO";

export class StatisticsService {
    public db: IDbAdapter = AppServiceContainer.db;
    private usersDao = new UsersDAO(AppServiceContainer.db);

    public async getLeaderboard(): Promise<DiscordControllerResponse>
    {
        let winners = await this.usersDao.getWinners();

        let result = "Первые победители:\n";
        let rank = 1;
        winners.forEach(u => {
            let date = new Date((u.started_at + u.time_to_complete) * 1000);
            let dateStr = date.getDate() + '.' + date.getMonth() + '.' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
            result += '**' + rank + ':' + u.character_name + ' - ' + u.realm + '** (Завершил(а) ' + dateStr + ')\n';
            rank++;
        });

        result += "\nРейтинг по скорости прохождения:\n";

        let leaders = await this.usersDao.getLeaderboard();
        rank = 1;
        leaders.forEach(u => {
            let hours = Math.floor(u.time_to_complete / 3600);
            let minutes = Math.floor((u.time_to_complete % 3600) / 60);
            let seconds = u.time_to_complete - hours * 3600 - minutes * 60;

            let timeStr = hours + ':' + minutes + ':' + seconds;
            result += '**' + rank + ':' + u.character_name + ' - ' + u.realm + '** (' + timeStr + ', ' + u.hints + ' подсказок)\n';
            rank++;
        });

        return new DiscordControllerResponse(result);
    }
}