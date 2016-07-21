import pick from 'lodash.pick';

const obj = { 'user': 'fred', 'age': 40 };

export default pick(obj, 'user');

