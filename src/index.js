import user from './app/user';
import another from './another';
((document) => {
    document.getElementById('root').innerHTML = user.user;
    another();
    console.log(user);
})(document);