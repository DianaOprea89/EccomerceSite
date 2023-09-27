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

        // isAuthenticated: !!localStorage.getItem('user'),
        // user: JSON.parse(localStorage.getItem('user')) || null,
        // cart: [],
    },

    mutations: {
        setUser(state, user) {

            state.email = user.email;
            state.password = user.password;
            state.name = user.name;
            state.cartItems = user.cartItems;
            state.id = user.id;
        }
        // SET_AUTHENTICATED(state, isAuthenticated) {
        //     state.isAuthenticated = isAuthenticated;
        // },
        // SET_USER(state, user) {
        //     console.log('Setting user data:', user);
        //     state.user = user;
        //     localStorage.setItem('user', JSON.stringify(user));
        //     state.isAuthenticated = true;
        //     console.log('User data set in Vuex store:', user);
        // },
        // LOGOUT(state) {
        //     state.user = null;
        //     localStorage.removeItem('user');
        // },
        // ADD_TO_CART(state, product) {
        //     console.log('Mutation: Adding to cart...', product);
        //     const existingProduct = state.cart.find(item => item.id === product.id);
        //     if (!existingProduct) {
        //         state.cart.push(product);
        //     }
        // },
        //
        //
        // REMOVE_FROM_CART(state, productId) {
        //     const index = state.cart.findIndex(item => item.id === productId);
        //     if (index !== -1) {
        //         state.cart.splice(index, 1);
        //
        //     }
        // },
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
        // loggedInUser: state => state.user,
        // cartItems: state => state.cart,

    },
    actions: {
        // addToCart({commit}, product) {
        //             console.log("Action: Adding to cart...", product);
        //     commit('ADD_TO_CART', product);
        //             console.log("Action: Cart after adding...", this.state.cart);
        // },
        // // setUser({ commit }, user) {
        // //     commit('SET_USER', user);
        // // },
        //
        //
        // removeFromCart({commit}, productId) {
        //     commit('REMOVE_FROM_CART', productId);
        // },
    },
});
