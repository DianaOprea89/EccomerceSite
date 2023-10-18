<template>
  <div id="page-wrap">
    <button @click="logout">Logout</button>
    <products-grid :products="products" :user-id="localUserId"></products-grid>
  </div>
</template>

<script>
import ProductsGrid from "@/components/ProductsGrid";
import api from "@/api/api";
import { mapGetters } from 'vuex';

export default {
  name: "ProductsPage",
  components: { ProductsGrid },
  data() {
    return {
      products: [],
      localUserId: null, // Create a local data property for userId
    };
  },
  computed: {
    ...mapGetters(['getUserId']),
  },
  async created() {
    try {
      const result = await api.get('/api/products');
      this.localUserId = this.getUserId; // Assign the userId to the local data property
      console.log("Result:", result);
      console.log('UserId in ProductsPage:', this.localUserId);
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
  },
};
</script>



<style scoped>

</style>