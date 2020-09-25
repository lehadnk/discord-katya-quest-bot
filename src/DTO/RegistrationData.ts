import Guild from "../Config/Guilds";

export default class RegistrationData {
    public guild: Guild;
    public realm: string;
    public stage: RegistrationStage;
    public discord_id: string;
    public discord_name: string;
    public discord_avatar: string;
    public character_name: string;
}

export enum RegistrationStage {
    NONE,
    CHARACTER_SELECTION,
    GUILD_SELECTION,
    REALM_SELECTION,
    FACTION_SELECTION,
}