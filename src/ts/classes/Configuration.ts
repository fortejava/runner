import { Worker } from "./Worker";

type menuData = {
    itemValue: string,
    viewId: string,
    viewName : string
}

export class Configuration
{
    public static contextID:string = "myApp";
    public static context:HTMLDivElement;
    public static mainMenu:menuData[];

    public static appInitializer():void
    {
        //Inizializzo il contesto della mia applicazione
        Configuration.context = document.querySelector(`#${Configuration.contextID}`);

        Configuration.menuBuilder();
        Configuration.menuRender();   
        Configuration.viewRender();   
        console.log(`Contesto inizializzato: ${Configuration.context.id}`);
    }

    private static menuBuilder():void
    {
        Configuration.mainMenu = [];
        Configuration.mainMenu.push( {itemValue:"Home", viewId:"home-view", viewName:"HomeView"});
        Configuration.mainMenu.push( {itemValue:"Registrati", viewId:"register-view", viewName: "RegisterView"});
        Configuration.mainMenu.push( {itemValue:"Su di noi", viewId:"about-view", viewName: "AboutView"});
    }

    private static menuRender():void
    {
        //Creo il container del menu
        const menuContainer:HTMLElement = document.createElement("nav");
        menuContainer.classList.add("menu-container");

        const menuList: HTMLElement = document.createElement("ul");
        menuContainer.appendChild(menuList);
        //Ciclo su tutti gli elementi della proprieta' mainMenu
        //Ad ogno giro, aggiungere la voce di menu al container

        for (const el of Configuration.mainMenu)
        {
            const menuElement:HTMLElement= document.createElement("li");
            menuElement.innerHTML=`
                <a href="javascript:void(0)" 
                data-open='${el.viewId}' 
                data-viewname='${el.viewName}'>
                ${el.itemValue}
                </a>
                `;

                menuElement.querySelector("a").addEventListener("click",Worker.changeView);
                menuList.appendChild(menuElement);
        }

        //Aggiungo il container al context
        Configuration.context.appendChild(menuContainer);
    }

    private static viewRender():void
    {
        const viewsContainer: HTMLElement = document.createElement("main");

        for (const el of Configuration.mainMenu)
        {
            viewsContainer.innerHTML += `<section class="view" data-id="${el.viewId}">
            </section>`;
        }

        //Definisco la view di default
        viewsContainer.querySelector(".view").classList.add("visible");

        //Aggiungo il container al context
        Configuration.context.appendChild(viewsContainer);
    }
}