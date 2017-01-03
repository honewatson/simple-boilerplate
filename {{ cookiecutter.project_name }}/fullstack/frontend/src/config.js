import { default as common } from './confs/common';

const config = {};

Object.keys(common).forEach(key => {
    config[key] = common[key];
});

export default config;