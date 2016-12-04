export default app => () => {

    let {title, content} = app.config.components;
    app.updateEl(
        title.ID,
        title.render(app, {})
    );
    app.updateEl(
        content.ID,
        content.render(app, {})
    )
};