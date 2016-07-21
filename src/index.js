import user from './app/user';
import another from './another';
((document) => {
    document.getElementById('root').innerHTML = `<h1>${user.user}</h1>`;
    // another();
    // console.log(user);
})(document);