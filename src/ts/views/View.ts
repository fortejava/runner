import { Configuration } from "../classes/Configuration";
export abstract class View
{
    public abstract render():void;
    protected static context: HTMLDivElement = Configuration.context;
    protected viewId:string;


    public constructor(viewId: string)
    {
        this.viewId = viewId;
        this.render();
    }
    
}