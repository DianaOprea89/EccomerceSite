<template>
  <div id="page-wrap">
    <h1>Shopping Cart</h1>
    <ProductsList
        :products="cartItems"
        v-on:remove-from-cart="removeFromCart($event)"
    ></ProductsList>
    <div>
      <h3 id="total-price">Total: ${{ totalPrice }}</h3>
      <button id="checkout-button">Proceed to Checkout</button>
    </div>
  </div>

</template>
<script>
import api from "@/api/api";
import ProductsList from "@/components/ProductsList";

export default {
  name: "CartPage",
  components: { ProductsList },
  data() {
    return {
      cartItems: [], // Initialize with an empty array
    };
  },
  computed: {
    totalPrice() {
      return this.cartItems.reduce(
          (sum, item) => sum + Number(item.price),
          0
      );
    },
  },
  created() {
    this.fetchData();
  },
  methods: {
    async removeFromCart(productId) {
      const userId = this.$store.getters.loggedInUser.id;
      try {
        const response = await api.delete(
            `/api/users/${userId}/cart/${productId}`
        );
        this.cartItems = response.data;
      } catch (error) {
        console.error('Error removing item from cart:', error);
      }
    },
    async fetchData() {
      if (this.$store.getters.isAuthenticated) {
        const userId = this.$store.getters.loggedInUser.id;
        console.log('Fetching cart data for userId:', userId);
        try {
          const response = await api.get(`/api/users/${userId}/cart`);
          console.log('Response data:', response.data);
          this.cartItems = response.data; // Update cartItems with the fetched data
        } catch (error) {
          console.error('Error fetching cart items:', error);
        }
      }
    },
  },
};
</script>

<style scoped>
h1 {
  border-bottom: 1px solid black;
  margin: 0;
  margin-top: 16px;
  padding: 16px;
}

#total-price {
  padding: 16px;
  text-align: right;
}

#checkout-button {
  width: 100%;
}

.product-container {
  align-content: center;
  border-bottom: 1px solid #ddd;
  display: flex;
  padding: 16px;
  width: 100%;
}

.product-image {
  flex: 1;
  height: 100px;
  max-width: 100px;
}

.details-wrap {
  padding: 0 16px;
  flex: 3;
}

.remove-button {
  flex: 1;
  margin: auto;
}
</style>
