import {ICommand} from "nergal";
import {AbstractCommand} from "nergal";
import User from "../Models/User";
import GameService from "../Services/Game/GameService";
import UsersDAO from "../DAO/UsersDAO";
import NotificationService from "../Services/NotificationService/NotificationService";

export default class TestGameComplete extends AbstractCommand implements ICommand {
    name: string = 'complete-game';

    async run(args: string[]) {
        // let service = new GameService();
        //
        // let user = new User();
        // user.discord_user_id = '345';
        // user.started_at = Math.ceil(Date.now() / 1000);
        // user.realm = 'Azuregos';
        // user.name = 'Test';
        // user.avatar_url = 'https://4.bp.blogspot.com/-ww35TX848nE/VwKzp_AExYI/AAAAAAAAACA/juHbkc0DQE4D_LLzUrldo1oQqrY6WV6lA/s400/apple_HLS.png';
        // user.level = 11;
        // user.faction = 'альянс';
        // user.character_name = 'Нейшира';
        // user.discord_guild_id = '203632333620772874';
        let dao = new UsersDAO(this.db);
        // // await dao.save(user);

        let notificationService = new NotificationService();
        let activePlayers = await dao.getActive();
        console.log(activePlayers);
        // await notificationService.broadcastToPlayers(activePlayers.map(u => u.discord_user_id), "Три отважных игрока завершили своё приключение!\nНо на этом всё не заканчивается, для Вас - оно продолжается. Чтобы посмотреть как обстоят дела у других - знайте, что список лидеров можно загрузить командой !лидеры.\nТакже Вам теперь доступны подсказки.\nДля получения - отправьте боту !подсказка (но не ранее, чем через 10 минут после выдачи задания). При этом - за каждую взятую подсказку Вы получите штраф (увеличение общего времени прохождения).\nВ некоторых вопросах может быть несколько подсказок. Если Вы решите взять вторую подсказку - команда та же, между взятием подсказок так же должно пройти не менее 10 минут, при этом, если вопрос окажется без дополнительных подсказок - штрафное время не будет прибавлено.\nНо всё-таки постарайтесь решить всё самостоятельно! Уверены, Вам это под силу!");
        await notificationService.broadcastToChannels("Три отважных игрока завершили своё приключение!\nНо на этом всё не заканчивается, для Вас - оно продолжается. Чтобы посмотреть как обстоят дела у других - знайте, что список лидеров можно загрузить командой !лидеры.\nТакже Вам теперь доступны подсказки.\nДля получения - отправьте боту !подсказка (но не ранее, чем через 10 минут после выдачи задания). При этом - за каждую взятую подсказку Вы получите штраф (увеличение общего времени прохождения).\nВ некоторых вопросах может быть несколько подсказок. Если Вы решите взять вторую подсказку - команда та же, между взятием подсказок так же должно пройти не менее 10 минут, при этом, если вопрос окажется без дополнительных подсказок - штрафное время не будет прибавлено.\nНо всё-таки постарайтесь решить всё самостоятельно! Уверены, Вам это под силу!");

        // await service.completeGame(user);

        console.log('game was completed');
    }
}