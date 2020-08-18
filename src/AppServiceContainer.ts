import AbstractServiceContainer from 'nergal/src/AbstractServiceContainer';
import Router from "./Router";

export default class AppServiceContainer extends AbstractServiceContainer {
    protected static router;

    public static init()
    {
        super.init();
    }

    public static async start()
    {
        this.router = new Router();
        super.updateRouter();
        await super.start();
    }
}