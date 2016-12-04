export default (app, data) => {

    return {
        content: "Hello World",
        story: app.immute.get().content.story
    }
};