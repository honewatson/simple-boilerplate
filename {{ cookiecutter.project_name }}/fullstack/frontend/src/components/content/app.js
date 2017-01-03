import { default as adminNew } from "./admin/new/component";
import { default as adminDelete } from "./admin/delete/component";
import { default as adminEdit } from "./admin/edit/component";
import { default as adminList } from "./admin/list/component";
import { default as list } from "./list/component";
import { default as view } from "./view/component";

const model = {
    type: 'content',
    primary: 'id',
    props: {
        id: 'integer',
        title: 'string',
        content: 'string'
    },
    post: [
        'title',
        'content'
    ],
    put: [
        'id',
        'title',
        'content'
    ],
    components: [
        adminNew,
        adminDelete,
        adminEdit,
        adminList,
        list,
        view
    ],
    title: 'title',
    editors: ['content'],
    fields: [
        {type: 'primary', id: 'id'},
        {type: 'text', id: 'title', default: ''},
        {type: 'wysiwyg', id: 'content', default: ''}
    ]

}

export default {
    model
};