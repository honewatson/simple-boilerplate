import { default as viewDefault } from "../edit/view";
import { default as renderBase } from "../../render";
import { default as title } from "../../title/component";
import { addEditor } from  '../../editor/component';
import { confirmAdminMenu } from '../../menu/component';
import { defaultValue } from  '../../../utils';

const prepData = componentConfig => (app, data) => {
    let origModel = app.immute.get()[componentConfig.base].model;
    let model = {
        type: origModel.type,
        fields: origModel.fields.filter(field => field.type !== 'primary')
    };
    model.fields.forEach(field => {
        if (typeof field.default !== 'undefined') {
            data[field.id] = field.default;
        }
        else {
            data[field.id] = '';
        }
    });
    let final = {
        model,
        data,
        base: componentConfig.base,
        method: 'post',
        grid: defaultValue('grid', 'g--9 m--3')(componentConfig)
    }
    return final;
}

export default (ID, componentConfig, view = viewDefault()) => {

    const init = app => {
    };

    const render = renderBase.withPrepData(ID, view, prepData(componentConfig));

    const route = app => id => {
        title.render(app, {title: "New " + componentConfig.base});
        render(app, {});
        addEditor(app, app.immute.get()[componentConfig.base].model);
        confirmAdminMenu(app.immute);
    };

    return {
        ID,
        render,
        init,
        route: [`/admin/${componentConfig.base}/new`, route]
    };
}
