import { default as button } from './view';
import { default as renderBase } from "../../render";
import { default as componentConfig } from '../config';
import { capitalize } from  '../../../utils';
import { default as title } from '../../title/component';
import { default as model } from "../model";
import { default as req } from "../../../handlers/request/crud";
import { default as view } from '../../crud/edit/view';
const ID = "main__content";

const render = renderBase.withoutPrepData(ID, view(button));

const registerModel = model();

registerModel.post = [
    'username',
    'password',
    'password_repeat',
    'accept_terms',
    'email',
    'csrf_token'
]

registerModel.fields = [
    {id: 'username', type: 'text', default: ''},
    {id: 'password', type: 'password', default: ''},
    {id: 'password_repeat', type: 'password', default: '', label: 'Password Repeat'},
    {id: 'email', type: 'email', default: ''},
    {id: 'csrf_token', type: 'hidden'},
    {
        id: 'accept_terms', type: 'checkbox', options: [
        {name: 'Accept Terms?', value: 'yes'},
        {name: 'No', value: ''}
    ],
        default: ''
    }
];

registerModel.fields.forEach(field => {
    registerModel[field.id] = field;
});

registerModel.route = '/api/user/register.json';

const init = app => {
    app.immute.set('user_register', {model: registerModel});
}

const renderForm = (app, data) =>
    render(app, {model: registerModel, data});


const route = app => () => {
    title.render(app, {title: capitalize(componentConfig.base)});
    req.getRoute(app, registerModel.route, renderForm);

};

export default {
    ID,
    render,
    route: [`/user/register`, route],
    init
};