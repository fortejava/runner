import { View } from "./View";

export class RegisterView extends View
{
    public render():void
    {
        const retvalue = `<p>Ciao a tutti da RegisterView</p>`;
        View.context
            .querySelector(`.view[data-id=${this.viewId}]`)
            .innerHTML = retvalue;
    }
}