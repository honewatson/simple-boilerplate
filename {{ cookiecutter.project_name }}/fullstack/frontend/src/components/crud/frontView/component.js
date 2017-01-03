import { default as view } from "./view";
import { default as renderBase } from "../../render";
import { default as req } from "../../../handlers/request/crud";
import { default as title } from "../../title/component";
import { defaultValue, isValue } from  '../../../utils';

const prepData = componentConfig => (app, data) => {
    return {
        model: app.immute.get()[componentConfig.base].model,
        data,
        base: componentConfig.base,
        grid: defaultValue('grid', 'g--9 m--3')(componentConfig)
    }
}

const viewTitle = (app, data) => {
    title.render(app, data);
}

export default (ID, componentConfig) => {

    const init = app => {
    };

    const render = renderBase.withPrepData(
        ID,
        view,
        prepData(componentConfig),
        viewTitle
    );

    const route = app => id => {
        if (isValue(app.immute.get(), 'admin')) {
            app.immute.set('admin.on', false);
        }
        else {
            app.immute.set('admin', {on: false});
        }
        req.get(app, componentConfig.base, render, id);
    };

    return {
        ID,
        render,
        init,
        route: [`/${componentConfig.base}/:id`, route]
    };
}
