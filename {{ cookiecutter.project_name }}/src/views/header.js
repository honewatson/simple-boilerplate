const ID = "header";

const view = app => {
    let {component_ids} = app.config;
    return `
        <div id="${component_ids.header__title}"></div>
    `;
}

export default  { ID, view }