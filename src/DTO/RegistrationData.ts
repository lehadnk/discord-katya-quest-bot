import Guild from "../Config/Guilds";

export default class RegistrationData {
    public guild: Guild;
    public realm: string;
    public stage: RegistrationStage;
}

export enum RegistrationStage {
    NONE,
    GUILD_SELECTION,
    REALM_SELECTION,
    FACTION_SELECTION,
}