import Config from "../../js/bootstrap/util/config";
import { HomeView } from "../views/HomeView";
export class Worker
{
    //Riparti con i ragazzi da qui
    public static async changeView(event)
    {
        console.log(`La classe da istanziare è ${event.currentTarget.getAttribute("data-viewname")}`);
        //Togliamo la classe visible alla vista corrente
        document.querySelector(".view.visible").classList.remove("visible");

        document.querySelector(`.view[data-id=${event.currentTarget.getAttribute("data-open")}]`).classList.add("visible");

        await Worker.viewLoader(
            event.currentTarget.getAttribute("data-viewname"),
            event.currentTarget.getAttribute("data-open")
        );
    }
        
    private static async viewLoader(viewToLoad: string, viewId: string): Promise<void> {
    try 
    {
        const myModule = await import(`../views/${viewToLoad}`);
        const myView = myModule[viewToLoad];

        new myView(viewId);

    } 
    catch (errore) 
    {
        console.error("Errore nel caricamento:", errore);
    }
}

    
}
