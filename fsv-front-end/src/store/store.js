import Vue from 'vue';
import Vuex from 'vuex';
import { calculateTotalPrice } from "../cartUtils.js"

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: {
            email: localStorage.getItem('userEmail') || '',
            password: localStorage.getItem('userPassword') || '',
            name: '',
            id: '',
            cartItems: {}, // Change cartItems to an object
        },
        products: [],
    },

    mutations: {
        setUser(state, payload) {
            state.user.email = payload.email;
            state.user.password = payload.password;
            state.user.name = payload.name;
            state.user.id = payload.id;
            state.user.cartItems = payload.cartItems || {};
        },
        UPDATE_CART(state, updatedCartData) {
            state.user.cartItems = updatedCartData;
        },
        clearUserData(state) {
            state.user = {
                email: '',
                password: '',
                name: '',
                id: '',
                cartItems: {}, // Reset cartItems when clearing user data
            };
        },
        setProducts(state, products) {
            state.products = products;
        },
    },
    getters: {
        isAuthenticated: (state) => {
            return !!state.user.email;
        },
        getName: (state) => state.user.name,
        getUserId: (state) => state.user.id,
        userEmail: (state) => state.user.email,
        userPassword: (state) => state.user.password,
        cartItems: (state) => state.user.cartItems, // Ensure you are using the object here
        cartTotalPrice: (state) => {
            return calculateTotalPrice(Object.values(state.user.cartItems));
        },
    },
    actions: {
        updateCart({ commit }, updatedCartData) {
            commit('UPDATE_CART', updatedCartData);
        },
        async loadUserData({ commit }) {
            try {
                let userEmail = localStorage.getItem('userEmail');
                let userPassword = localStorage.getItem('userPassword');

                const response = await fetch('http://localhost:8006/api/userData', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
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
        },
        async loadProducts({ commit }) {
            try {
                const response = await fetch('http://localhost:8006/api/products');
                if (response.ok) {
                    const productData = await response.json();
                    commit('setProducts', productData); // Commit the product data to the store
                } else {
                    throw new Error('Failed to fetch product data');
                }
            } catch (error) {
                console.error('Failed to load product data:', error);
            }
        },
    },
});
