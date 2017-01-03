import { default as view } from "./view";
import { default as renderBase } from "../../render";
import { default as config } from "../../../config";
import { default as req } from "../../../handlers/request/crud";
import { default as title } from "../../title/component";
import { capitalize, pagination } from '../../../utils';
import { defaultValue } from  '../../../utils';

const prepData = componentConfig => (app, data) => {
    let model = app.immute.get()[componentConfig.base].model;
    data.pages = pagination(data, config.pagination);
    data.type = model.type;
    data.primary = model.primary;
    data.title = model.title;
    data.grid = defaultValue('grid', 'g--9 m--3')(componentConfig);
    return data;
};

export default (ID, componentConfig, altView = null) => {
    const render = renderBase.withPrepData(ID, altView ? altView : view, prepData(componentConfig));
    const init = app => {

    };
    const route = app => () => {
        title.render(app, {title: capitalize(componentConfig.base)});
        req.list(app, componentConfig.base, render);
    };
    return {
        ID,
        render,
        init,
        route: [`/${componentConfig.base}`, route],
        reset: renderBase.reset(ID)
    };
}

