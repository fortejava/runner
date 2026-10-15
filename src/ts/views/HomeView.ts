import { View } from "./View";

export class HomeView extends View
{
    public render():void
    {
        const retvalue = `<h1>Vista Home</h1>
        <p>Ciao a tutti da HomeView</p>
        <form method="POST" action="#" name="login-form" id="login-form" >
        </form>`;
        HomeView.context
            .querySelector(`.view[data-id=${this.viewId}]`)
            .innerHTML = retvalue;
    }

    public loginManager():void
    {
        
    }
}