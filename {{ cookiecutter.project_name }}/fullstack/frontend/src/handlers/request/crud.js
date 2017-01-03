import { default as qwest } from 'qwest';
import { defaultValue, isValue } from '../../utils';

const error = immute => response => {
    immute.set('messages.errors', JSON.parse(response.response));
    console.log(response);
}

const noErrors = (immute, response) => {
    if (typeof response.errors !== 'undefined' && response.errors.length) {
        immute.set('messages.errors', response.errors);
        return false;
    }
    else {
        return true;
    }
}

const getRoute = (app, route, renderOrRoute) =>
    qwest.get(route)
        .then(response => {
            let data = JSON.parse(response.response);
            if (noErrors(app.immute, data)) {
                if (typeof renderOrRoute == 'string') {
                    app.router.navigate(renderOrRoute);
                }
                else {
                    renderOrRoute(app, data);
                }
            }
        })
        .catch(error(app.immute));

const getRouteCached = (app, route, render) => {
    const doRender = data => {
        let queue = app.getQueue(route);
        queue.forEach(render => {
            if (noErrors(app.immute, data)) {
                render(app, data);
            }
        })
    }
    let data = app.requestCache(route);
    if (data === 'pending') {
        app.setQueue(route, render);
    }
    else if (!data) {
        app.setQueue(route, render);
        app.requestCache(route, 'pending');
        qwest.get(route)
            .then(response => {
                let data = JSON.parse(response.response);
                app.requestCache(route, data);
                doRender(data);
            })
            .catch(error(app.immute));
    }
    else {
        app.setQueue(route, render);
        doRender(data);
    }

}


const get = (app, type, render, id) =>
    qwest.get(`/api/${type}/${id}.json`)
        .then(response => {
            let data = JSON.parse(response.response);
            if (noErrors(app.immute, data)) {
                render(app, data);
            }

        })
        .catch(error(app.immute));

const search = (app, type, render, query) =>
    qwest.post(`/api/${type}/search.json`, query)
        .then(response => {
            let data = JSON.parse(response.response);
            if (noErrors(app.immute, data)) {
                render(app, data);
            }

        })
        .catch(error(app.immute));

const list = (app, type, render) =>
    qwest.get(`/api/${type}.json` + app.window.location.search)
        .then(response => {
            let data = JSON.parse(response.response)
            if (noErrors(app.immute, data)) {
                app.immute.set(`${type}.list`, data);
                render(app, data);
            }
        })
        .catch(error(app.immute));

const delBase = refresh => (app, obj) =>
    qwest.delete(`/api/${obj.type}/${obj.id}.json`)
        .then(response => {

            if (noErrors(app.immute, JSON.parse(response.response))) {
                if (refresh) {
                    let refreshRoute = app.location.pathname + '?v=' + Date.now();
                    app.router.navigate(refreshRoute)
                }
                else {
                    app.router.navigate(`/admin/${obj.type}/list`);
                }

            }
        })
        .catch(error(app.immute));

const del = delBase(false);

const delRefresh = delBase(true);

const inputValue = defaultValue('value', '');

const getOption = select =>
    [...select.getElementsByTagName('option')]
        .find(item => typeof item.selected !== 'undefined' && item.selected).value;

const checkboxValue = div => {
    return [...div.getElementsByTagName('input')]
        .find(item => item.checked)
        .value;
}

const radioValue = div => {
    return [...div.getElementsByTagName('input')]
        .find(item => item.checked)
        .value
}

const tags = {
    input: inputValue,
    textarea: inputValue,
    select: getOption,
    checkbox: checkboxValue,
    radio: radioValue
};

const formFactory = (FormData, title, el, data) => {
    var formData = new FormData();
    formData.append("title", title);
    formData.append("upload", el.files[0]);
    formData.append("csrf_token", data.csrf_token)
    return formData;
}

const postPut = (method, obj, result, app, callback) =>
    qwest[method](isValue(obj, 'route') ? obj.route : `/api/${obj.type}.json`, result)
        .then(response => {
            let data = JSON.parse(response.response)
            if (noErrors(app.immute, data)) {
                app.immute.set(`${obj.type}.edit`, data);
                if (!callback) {
                    app.immute.set('messages.success', ["Successfully Saved!"]);
                    app.router.navigate(`/admin/${obj.type}/edit/${data.id}?v=${Date.now()}`);
                }
                else {
                    callback(app, data);
                }

            }

        })
        .catch(error(app.immute));


const save = (method, app, model, callback = false) => {
    let result = {};
    let files = [];
    let obj = app.immute.get()[model].model;
    let editors = obj.editors;

    obj[method].forEach(field => {
        if (editors.indexOf(field) != -1) {
            let editor = app.store[`${obj.type}__${field}.editor`];
            result[field] = editor.root.innerHTML;

        }
        else {

            let el = app.document.getElementById(obj.type + '__' + field);
            let tagName = el.tagName.toLowerCase();
            // We need to use data-type for checkboxes wrapped with a div
            let fieldType = typeof el.type != 'undefined' ? el.type.toLowerCase() : el.getAttribute('data-type');

            if (tagName === 'input' && fieldType === 'file') {
                if (el.files.length) {
                    files.push({field, el});
                }
            }
            else if (isValue(tags, fieldType)) {
                result[field] = tags[fieldType](el);
            }
            else {
                result[field] = tags[tagName](el);
            }
        }

    });

    const postedFiles = {};

    const getCsrf = requestPath =>
        qwest.get(requestPath);

    const postFile = (file, requestPath, result) => response => {
        let data = JSON.parse(response.response)
        qwest.post(requestPath, formFactory(app.window.FormData, result.title, file.el, data))
            .then(response => {
                postedFiles[file.field] = JSON.parse(response.response);
            })
    }

    const afterFilesPostObject = (postedFiles, files) => {
        app.readyF(
            () => Object.keys(postedFiles).length == files.length,
            () => {
                Object.keys(postedFiles).forEach(key => {
                    result[key] = postedFiles[key];
                })
                postPut(method, obj, result, app, callback);
            }
        )
    }

    if (files.length) {
        files.forEach(file => {
            let requestPath = `/api/${obj.type}/upload`;
            getCsrf(requestPath)
                .then(postFile(file, requestPath, result))
        })
        afterFilesPostObject(postedFiles, files)
    }
    else {
        postPut(method, obj, result, app, callback)
    }


}

export default {get, list, save, del, search, error, delRefresh, getRoute, getRouteCached}
