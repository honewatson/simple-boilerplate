export default (components = []) => ({
    type: 'user',
    primary: 'id',
    props: {},
    post: [],
    put: [],
    components,
    title: 'username',
    editors: [],
    grid: 'g--12',
    fields: [
        {type: 'primary', id: 'id'},
    ]
})