import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
        state: {
            user: {
                email: localStorage.getItem('userEmail') || '',
                password: localStorage.getItem('userPassword') || '',
                name: '',
                id: '',
                cartItems: []
            }
        },

    mutations: {
        setUser(state, payload) {
            state.user.email = payload.email;
            state.user.password = payload.password;
            state.user.name = payload.name;
            state.user.id = payload.id;
            state.user.cartItems = payload.cartItems || [];
        },
        UPDATE_CART(state, payload) {
            state.user.cartItems = payload;
        }
    },
    getters: {
        isAuthenticated: state => {
            return !!state.user.email;  // Using the double NOT (!!) operator to convert truthy/falsy to boolean.
        },
        getName: state => state.user.name,
        getUserId: state => state.user.id,
        userEmail: state => state.user.email,
        userPassword: state => state.user.password  // Not recommended
    },
    actions: {
        updateCart({ commit }, updatedCartData) {
            commit('UPDATE_CART', updatedCartData);
        },
        async loadUserData({ commit }) {
            try {
                let userEmail = localStorage.getItem('userEmail');
                let userPassword = localStorage.getItem('userPassword');

                const response = await fetch("http://localhost:8006/api/userData", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: userEmail,
                        password: userPassword,
                    }),
                });

                if (response.ok) {
                    const fullUserData = await response.json();
                    commit('setUser', fullUserData);
                } else {
                    throw new Error('Failed to fetch user data');
                }
            } catch (error) {
                console.error('Failed to load user data:', error);
            }
        }


    }
});
