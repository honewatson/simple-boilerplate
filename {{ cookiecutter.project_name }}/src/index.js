import {default as config} from './config';
import {default as App} from './app';
import {eventManagerFactory} from './ev';
import {default as eventListeners} from './eventListeners';
import {default as Router} from 'slim-router';

const app = new App(
    window,
    document,
    new Router(),
    eventManagerFactory(window, eventListeners),
    config
);

app.start();