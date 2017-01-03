import { onlyIf } from '../utils';

const withoutPrepData = (ID, view) => (app, data) =>
    app.updateEl(
        ID,
        "innerHTML",
        view(data)
    );

const render = (view, data) => (app, elInst, el) =>
    elInst.innerHTML = view(data);

const refreshWithoutPrepData = (ID, view) => (app, data) =>
    app.readyC(
        ID,
        render(view, data)
    );

const withPrepData = (ID, view, prepData, ...renders) => (app, data) => {
    let preppedData = prepData(app, data);
    withoutPrepData(ID, view)(app, preppedData);
    renders.forEach(render => {
        render(app, data, preppedData);
    })
};

const refreshWithPrepData = (ID, view, prepData, ...renders) => (app, data) => {
    let preppedData = prepData(app, data);
    refreshWithoutPrepData(ID, view)(app, preppedData);
    renders.forEach(render => {
        render(app, data, preppedData);
    })
};

const reset = ID => app =>
    onlyIf(app.document.getElementById(ID))
        .then(el => el.innerHTML = '');

export default {
    withPrepData,
    refreshWithPrepData,
    withoutPrepData,
    refreshWithoutPrepData,
    reset
};
