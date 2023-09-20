
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: JSON.parse(localStorage.getItem('user')) || null,
    },
    mutations: {
        SET_USER(state, user) {
            console.log('Setting user data:', user);
            state.user = user;
            localStorage.setItem('user', JSON.stringify(user));
            console.log('User data set in Vuex store:', user);

        },
        LOGOUT(state) {
            state.user = null;
            localStorage.removeItem('user');
        }
    },
    getters: {
        isAuthenticated: state => {
            const isAuthenticated = !!state.user;
            console.log('isAuthenticated:', isAuthenticated);
            return isAuthenticated;
        },
        loggedInUser: state => state.user,
    }
});
