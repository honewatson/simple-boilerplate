export default obj => typeof obj.user !== 'undefined' ? `
        <button class="btn--green btn--raised" onclick="return ev({route: '/api/user/logout.json', redirect: '/user/login'}, 'getRedirect')">Logout</button>
    ` : `<button class="btn--green btn--raised" onclick="return ev('/user/login', 'route')">Login</button>`;