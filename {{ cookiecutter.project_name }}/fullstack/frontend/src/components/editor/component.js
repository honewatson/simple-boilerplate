import Quill from 'quill';

const TOOLBAR_CONFIG = [
    [{header: ['1', '2', '3', '4', false]}],
    ['bold', 'italic', 'underline', 'link'],
    [{list: 'ordered'}, {list: 'bullet'}],
    ['clean']
];

const isEditorReady = (app, el) => () =>
    app.document.getElementById(el);

const editorReady = (_type, el) => app => {
    const editor = new Quill(`#${el}`, {
        theme: 'bubble',
        placeholder: `Add some ${_type}...`,
        modules: {
            toolbar: TOOLBAR_CONFIG
        },
    });
    app.set(`${el}.editor`, editor);
}

export const addEditor = (app, model) => {
    var el;

    model.editors.forEach(editor => {
        el = `${model.type}__${editor}`;
        app.readyF(isEditorReady(app, el), editorReady(model.type, el))
    });


}
