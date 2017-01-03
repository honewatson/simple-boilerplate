import { default as view } from "./view";
import { default as renderBase } from "../../render";
import { default as req } from "../../../handlers/request/crud";
import { default as title } from "../../title/component";
import { confirmAdminMenu } from '../../menu/component';


export default (ID, componentConfig) => {

    const render = renderBase.withoutPrepData(ID, view(componentConfig));

    const route = app => id => {
        title.render(app, {title: `Delete ${componentConfig.base}`});
        req.get(app, componentConfig.base, render, id);
        confirmAdminMenu(app.immute);
    };

    const init = app => {
    };

    return {
        ID,
        render,
        init,
        route: [`/admin/${componentConfig.base}/delete/:id`, route]
    };
}
