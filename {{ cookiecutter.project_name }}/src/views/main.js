const ID = "main";

const view = app => {
    let {component_ids} = app.config;
    return `
        <div id="${component_ids.main__content}"></div>
    `;
}

export default { ID, view }