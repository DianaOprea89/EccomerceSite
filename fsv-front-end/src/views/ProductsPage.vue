<template>
  <div id="page-wrap">
    <button @click="logout">Logout</button>
    <products-grid :products="products"></products-grid>
  </div>

</template>

<script>

import ProductsGrid from "@/components/ProductsGrid";
import api from "@/api/api";


export default {
  name: "ProductsPage",
  components: {ProductsGrid},
  data() {
    return {
      products: [],
    };
  },
  async created() {
    const result = await api.get('/api/products');
    const products = result.data;
    this.products = products;
  },
  methods: {
    logout() {
      // Remove user information from local storage
      localStorage.removeItem("user");

      // Redirect the user to the login page or any other appropriate page
      this.$router.push("/login"); // Redirect to the login page
    },

  }
}
</script>


<style scoped>

</style>