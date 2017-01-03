import { forgotInitButton, forgotButton } from './view';
import { default as renderBase } from "../../render";
import { default as componentConfig } from '../config';
import { capitalize, qsParams, isValue } from  '../../../utils';
import { default as title } from '../../title/component';
import { default as model } from "../model";
import { default as req } from "../../../handlers/request/crud";
import { default as view } from '../../crud/edit/view';
const ID = "main__content";

const renderForgotInit = renderBase.withoutPrepData(ID, view(forgotInitButton));
const renderForgot = renderBase.withoutPrepData(ID, view(forgotButton));

const forgotModel = model();

forgotModel.post = [
    'token',
    'password',
    'password_repeat',
    'csrf_token'
]

forgotModel.fields = [
    {id: 'token', type: 'hidden', default: ''},
    {id: 'password', type: 'password', default: ''},
    {id: 'password_repeat', type: 'password', default: '', label: 'Password Repeat'},
    {id: 'csrf_token', type: 'hidden'},
];

forgotModel.fields.forEach(field => {
    forgotModel[field.id] = field;
});

forgotModel.route = '/api/user/forgot-password.json';

const forgotInitModel = model();

forgotInitModel.post = [
    'email',
    'csrf_token'
]

forgotInitModel.fields = [
    {id: 'email', type: 'email', default: ''},
    {id: 'csrf_token', type: 'hidden'},
];

forgotInitModel.fields.forEach(field => {
    forgotInitModel[field.id] = field;
});

forgotInitModel.route = '/api/user/forgot-password.json';


const init = app => {
    app.immute.set('user_forgot', {model: forgotModel});
    app.immute.set('user_forgot_init', {model: forgotInitModel});
}

const renderForm = (app, data) => {
    let params = qsParams(app.window.location.search);
    if (isValue(params, 'token')) {
        data.token = params.token;
        renderForgot(app, {model: forgotModel, data})
    }
    else {
        renderForgotInit(app, {model: forgotInitModel, data})
    }
}

const route = app => () => {
    title.render(app, {title: capitalize(componentConfig.base)});
    req.getRoute(app, forgotModel.route, renderForm);

};

export default {
    ID,
    render: renderForgotInit,
    route: [`/user/forgot-password`, route],
    init
};