import pick from 'lodash.pick';
import handler from './handler';

const obj = { 'user': handler() + ' fred', 'age': 40 };

console.log('hello world from user');

export default pick(obj, 'user');

