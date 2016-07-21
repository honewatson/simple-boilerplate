import user from './user';
import 'stylesheets/base';
((document) => {
    document.getElementById('root').innerHTML = user.user;
    console.log(user);
})(document);