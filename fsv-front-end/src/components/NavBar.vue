<template>
  <div id="nav-bar">
    <div class="header">
      <router-link to="/products" id="products-link">
        <h1>FABULOUS FOOTWEAR</h1>
      </router-link>
    </div>
    <div>

      <router-link v-if="!isAuthenticated" to="/login" id="log-link">
        <button class="nav-item">Login</button>
      </router-link>
      <router-link v-if="!isAuthenticated" to="/register" id="reg-link">
        <button class="nav-item">Register</button>
      </router-link>


      <span v-if="isAuthenticated" class="user-span">Hello, {{ loggedInUser }}!</span>
      <button v-if="isAuthenticated" @click="logout">Logout</button>

      <router-link to="/products" id="nav-link">
        <button class="nav-item">Products</button>
      </router-link>
      <router-link v-if="isAuthenticated" :to="`/users/${getUserId}/cart`" id="cart-link">
        <button>Cart!</button>
      </router-link>
    </div>
  </div>
</template>

<script>

export default {
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    loggedInUser() {
      return this.$store.getters.getName;
    },
    getUserId() {
      return this.$store.getters.getUserId;
    }

  },
  methods: {
    logout() {
      this.$store.commit('clearUserData');
      this.$store.commit('clearCartData');

      localStorage.removeItem('userEmail');
      localStorage.removeItem('userPassword');

      this.$router.push('/login').then(() => this.$router.go());
    }
  },

  created() {
    if (this.$store.getters.isAuthenticated === false) {
      this.$router.push("/login");

    }
  }

};
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap');


body {
  font-family: 'Open Sans', sans-serif;
  font-size: 16px;
}


button {
  font-weight: 700;
  color: #ffffff;
  cursor: pointer;
  padding: 10px 20px;
  background-color: #4a4a4a;
  border: none;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  font-size: 16px;
  margin: 0 5px;
}

button:hover {
  background-color: #6a6a6a;
}


.user-span {
  font-weight: 700;
  color: #4a4a4a;
  margin-right: 10px;
  font-size: 18px;
  line-height: 40px;

}


#nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  background-color: #f1f1f1;
  border-bottom: 1px solid #e0e0e0;
}

.header {
  font-weight: 700;
  font-size: 1.5em;
  color: #4a4a4a;
}

#products-link, #log-link, #reg-link, #nav-link, #cart-link {
  text-decoration: none;
  color: #4a4a4a;
  padding: 0 12px;
}
#products-link:hover, #log-link:hover, #reg-link:hover, #nav-link:hover, #cart-link:hover {
  color: #6a6a6a;
  text-decoration: underline;
}

#nav-bar > div:nth-child(2) {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 500px;
}
</style>
