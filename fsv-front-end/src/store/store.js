import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        email: '',
        password: '',
        name: '',
        id: '',
        cartItems: []

    },

    mutations: {
        setUser(state, user) {

            state.email = user.email;
            state.password = user.password;
            state.name = user.name;
            state.cartItems = user.cartItems;
            state.id = user.id;
        },
        UPDATE_CART(state, payload) {
            state.cartItems = payload;
        },

    },
    getters: {
        isAuthenticated: state => {
            if (state.email) {
                return true;
            }
            return false;
        },

        getName:state => state.name,
        getUserId:state => state.id


    },
    actions: {
        updateCart({ commit }, updatedCartData) {
            commit('UPDATE_CART', updatedCartData);
        },
    },
});
