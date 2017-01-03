import { onlyIf } from '../../utils';

export const removeCruft = (component, removeEls) => {
    let origRoute = component.route[1];
    let newRoute = app => () => {
        removeEls.forEach(removeEl => {
            onlyIf(app.document.getElementById(removeEl))
                .then(el => el.innerHTML = '');
        })
        origRoute(app)();
    }
    component.route[1] = newRoute;
    return component;
}