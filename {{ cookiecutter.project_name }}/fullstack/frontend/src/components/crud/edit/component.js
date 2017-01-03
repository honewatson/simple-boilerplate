import { default as viewDefault } from "./view";
import { default as renderBase } from "../../render";
import { default as req } from "../../../handlers/request/crud";
import { default as title } from "../../title/component";
import { addEditor } from  '../../editor/component';
import { confirmAdminMenu } from '../../menu/component';
import { defaultValue } from  '../../../utils';

export const prepData = componentConfig => (app, data) => {
    let final = {
        model: app.immute.get()[componentConfig.base].model,
        data,
        base: componentConfig.base,
        method: 'put',
        grid: defaultValue('grid', 'g--9 m--3')(componentConfig)
    }

    return final;
}

export default (ID, componentConfig, view = viewDefault()) => {

    const init = app => {
    };

    const render = renderBase.withPrepData(ID, view, prepData(componentConfig));

    const route = app => id => {
        app.updateEl(
            ID,
            "innerHTML",
            ''
        );
        title.render(app, {title: "Edit " + componentConfig.base});
        req.get(app, componentConfig.base, render, id);
        addEditor(app, app.immute.get()[componentConfig.base].model);
        confirmAdminMenu(app.immute);
    };

    return {
        ID,
        render,
        init,
        route: [`/admin/${componentConfig.base}/edit/:id`, route]
    };
}
