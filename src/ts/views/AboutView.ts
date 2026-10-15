import { View } from "./View";

export class AboutView extends View
{
    public render():void
    {
        const retvalue = `<p>Ciao a tutti da AboutView</p>`;
        View.context
            .querySelector(`.view[data-id=${this.viewId}]`)
            .innerHTML = retvalue;
    }
}