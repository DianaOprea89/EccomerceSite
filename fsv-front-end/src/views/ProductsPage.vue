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
    try {
      const result = await api.get('/api/products');
      console.log("Result:", result);
      const products = result.data;
      this.products = products;
    } catch (error) {
      console.error('An error occurred while fetching data:', error);
    }
  },
  methods: {
    logout() {

      localStorage.removeItem("user");


      this.$router.push("/login");
    },

  }
}
</script>


<style scoped>

</style>