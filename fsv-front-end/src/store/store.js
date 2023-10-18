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

        },

    },

    mutations: {
        setUser(state, payload) {
            state.user.email = payload.email;
            state.user.password = payload.password;
            state.user.name = payload.name;
            state.user.id = payload.id;

        },
        clearUserData(state) {
            state.user = {
                email: '',
                password: '',
                name: '',
                id: '',
            };
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
    },
    actions: {
        async loadUserData({commit}) {
            try {
                let userEmail = localStorage.getItem('userEmail');
                let userPassword = localStorage.getItem('userPassword');
                let userId = localStorage.getItem('getUserId')

                const response = await fetch('http://localhost:8006/api/userData', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: userEmail,
                        password: userPassword,
                        userId: userId
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
    },
});
