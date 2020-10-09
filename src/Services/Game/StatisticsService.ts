import {DiscordControllerResponse, IDbAdapter} from "nergal";
import AppServiceContainer from "../../AppServiceContainer";
import UsersDAO from "../../DAO/UsersDAO";
import TakenHintsDAO from "../../DAO/TakenHintsDAO";

export class StatisticsService {
    public db: IDbAdapter = AppServiceContainer.db;
    private usersDao = new UsersDAO(AppServiceContainer.db);

    private trailingZero(number: number): string
    {
        return number < 10 ? '0' + number : number.toString();
    }

    public async getLeaderboard(): Promise<DiscordControllerResponse>
    {
        let winners = await this.usersDao.getWinners();

        let result = "Первые победители:\n";
        let rank = 1;
        winners.forEach(u => {
            let date = new Date((u.started_at + u.time_to_complete) * 1000);
            let dateStr = this.trailingZero(date.getDate()) + '.' + this.trailingZero(date.getMonth()) + '.' + date.getFullYear() + ' ' + this.trailingZero(date.getHours()) + ':' + this.trailingZero(date.getMinutes());
            result += '**' + rank + ': ' + u.character_name + ' - ' + u.realm + '** (Завершил(а) ' + dateStr + ')\n';
            rank++;
        });

        result += "\nРейтинг по скорости прохождения:\n";

        let leaders = await this.usersDao.getLeaderboard();
        rank = 1;
        leaders.forEach(u => {
            let hours = Math.floor(u.time_to_complete / 3600);
            let minutes = Math.floor((u.time_to_complete % 3600) / 60);
            let seconds = u.time_to_complete - hours * 3600 - minutes * 60;

            let timeStr = this.trailingZero(hours) + ':' + this.trailingZero(minutes) + ':' + this.trailingZero(seconds);
            result += '**' + rank + ': ' + u.character_name + ' - ' + u.realm + '** (' + timeStr + ', ' + u.hints + ' подсказок)\n';
            rank++;
        });

        return new DiscordControllerResponse(result);
    }

    public async getFirstResponses(question: number)
    {
        let leaders = await this.usersDao.getLeaders(question);

        let result = "Первые ответившие на вопрос **"+question+"**:\n";

        let rank = 1;
        leaders.forEach(u => {
            let date = new Date((u.given_at) * 1000);
            let dateStr = this.trailingZero(date.getDate()) + '.' + this.trailingZero(date.getMonth()) + '.' + date.getFullYear() + ' ' + this.trailingZero(date.getHours()) + ':' + this.trailingZero(date.getMinutes());
            result += '**' + rank + ': ' + u.character_name + ' - ' + u.realm + '** (Ответил(а) ' + dateStr + ')\n';
            rank++;
        });

        return new DiscordControllerResponse(result);
    }

    public async getPersonalStat(discord_user_id: string)
    {
        let user = await this.usersDao.getOneByField('discord_user_id', discord_user_id);
        if (!user || user.level !== 12) {
            return new DiscordControllerResponse("Вы еще не прошли игру!");
        }
        let ranks = await AppServiceContainer.db.all("SELECT discord_user_id, started_at + time_to_complete as completed_at\n" +
            "FROM users\n" +
            "WHERE time_to_complete IS NOT NULL\n" +
            "ORDER BY completed_at ASC"
        );

        let users = ranks.map(u => u.discord_user_id);
        let rank = users.indexOf(discord_user_id) + 1;

        let result = "Вы прошли игру **" + rank + "** по скорости\n";
        for(let l = 1; l <= 11; l++) {
            let playersCnt = await this.getCorrectAnswersCount(l);
            result += l + " вопрос был решен " + await this.getQuestionRank(l, user.id) + ' среди всех '+ playersCnt +' решивших его игроков\n';
        }

        let hintsRepository = new TakenHintsDAO(AppServiceContainer.db);
        let hints = await hintsRepository.getAllByField('user_id', user.id.toString());
        let hintsCnt = 0;
        for(const h of hints) {
            hintsCnt += h.amount;
        }

        let penalty = await hintsRepository.getTotalPenalty(user.id);
        let date = new Date((user.started_at + user.time_to_complete) * 1000);
        let dateStr = this.trailingZero(date.getDate()) + '.' + this.trailingZero(date.getMonth()) + '.' + date.getFullYear() + ' ' + this.trailingZero(date.getHours()) + ':' + this.trailingZero(date.getMinutes());

        let hours = Math.floor(user.time_to_complete / 3600);
        let minutes = Math.floor((user.time_to_complete % 3600) / 60);
        let seconds = user.time_to_complete - hours * 3600 - minutes * 60;
        let timeStr = this.trailingZero(hours) + ':' + this.trailingZero(minutes) + ':' + this.trailingZero(seconds);

        result += '\nПрохождение было завершено '+ dateStr +' и заняло ' + timeStr + ', взято ' + hintsCnt + ' подсказок (' + penalty / 60 + ' минут штрафа)';

        return new DiscordControllerResponse(result);
    }

    private async getQuestionRank(level: number, user_id: number)
    {
        let ranks = await AppServiceContainer.db.all("SELECT user_id\n" +
            "FROM answer_attempts\n" +
            "WHERE level = ?1 AND is_correct = 1\n" +
            "ORDER BY given_at;", {
            1: level,
        });

        return ranks.map(r => r.user_id).indexOf(user_id) + 1;
    }

    private async getCorrectAnswersCount(level: number)
    {
        return parseInt(await AppServiceContainer.db.value("SELECT count(id) as cnt\n" +
            "FROM answer_attempts\n" +
            "WHERE is_correct = 1 AND level = ?1", {
            1: level,
        }));
    }
}