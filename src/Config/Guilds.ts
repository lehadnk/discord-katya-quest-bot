export default class Guild {
    discord_id: string;
    name: string;
    icon: string;
    classColor: string;

    constructor(discord_id: string, name: string, icon: string, classColor: string) {
        this.discord_id = discord_id;
        this.name = name;
        this.icon = icon;
        this.classColor = classColor;
    }
}

let guildList: Guild[] = [
    new Guild('207912188407578624', 'Храм Света Пустоты', 'priest', 'FFFFFE'), // Присты
    new Guild('203632333620772874', 'Роща снов', 'druid', 'FF7D0A'), // Друиды
    new Guild('452908426276634634', 'Цитадель Ледяной Короны', 'deathknight', 'C41F3B'), // ДК
    new Guild('217528830418616322', 'Небесная цитадель', 'warrior', 'C79C6E'), // Вары
    new Guild('210643527472906241', 'Обитель Света', 'paladin', 'F58CBA'), // Паладины
    new Guild('215427955193544704', 'Приют Стрелка', 'hunter', 'A9D271'), // Охотники
    new Guild('214750173413376003', 'Водоворот', 'shaman', '0070DE'), // Шаманы
    new Guild('215548192891076610', 'Молот Скверны', 'demonhunter', 'A330C9'), // Старые ДХ
    new Guild('217529277489479681', 'Храм Пяти Рассветов', 'monk', '00FF96'), // Монки
    new Guild('212664465181769728', 'Оплот хранителя', 'mage', '40C7EB'), // Маги
    new Guild('217529170291458048', 'Разлом зловещего шрама', 'warlock', '8787ED'), // Варлоки
    // Не очень понятно как их различать, и нужно ли это - возможно попросить иконку у Родриги?
    // new Guild('736173202979422271', 'Demon Hunter Community', '', 'A330C9'), // Новые ДХ
    new Guild('217529023838814208', 'Палата теней', 'rogue', 'FFF569'), // Роги
];

let guildByIdMap = new Map<string, Guild>();
guildList.forEach(g => guildByIdMap.set(g.discord_id, g));

export const guildsById = guildByIdMap;

let guildsByEmojiMap = new Map<string, Guild>();
guildList.forEach(g => guildsByEmojiMap.set(g.icon, g));

export const guildByEmoji = guildsByEmojiMap;

import {config as dotenvInit} from "dotenv";
dotenvInit();
export const guildBroadcastChannels = JSON.parse(process.env.GUILD_BROADCAST_CHANNELS);

export const availableRealms = [
    'гордунни',
    'свежевательдуш',
    'азурегос',
    'kazzak',
    'argentdawn',
    'ревущийфьорд',
    'ревущийфьёрд',
    'ревущийфъорд',
    'ревущийфъёрд',
    'галакронд',
    'ткачсмерти',
    'черныйшрам',
    'чёрныйшрам',
    'борейскаятундра',
    'гром',
    'термоштепсель',
    'пиратскаябухта',
    'подземье',
    'разувий',
    'голдринн',
    'корольлич',
];
