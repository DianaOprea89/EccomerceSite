<template>
  <div id="page-wrap">
    <h1>Shopping Cart </h1>
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
  components: {ProductsList},
  props: ['userId'],
  data() {
    return {
      cartItems: [],
      isLoading: false,
      error: null,
    };
  },
  watch: {
    '$store.state.cart': {
      handler() {
        this.fetchData();
      },
      deep: true,
    },
  },
  computed: {
    totalPrice() {
      if (!Array.isArray(this.cartItems)) {
        return 0;
      }

      const total = this.cartItems.reduce((sum, item) => {
        const price = Number(item.price);

        if (!isNaN(price)) {
          return sum + price;
        } else {
          console.warn(`Invalid price for item: ${item.name}`);
          return sum;
        }
      }, 0);

      return total;
    },

  },
  created() {
    this.fetchData();
  },
  methods: {
    async removeFromCart(productId) {
      this.isLoading = true;
      const userId = this.userId;
      try {
        const response = await api.delete(`/api/users/${userId}/cart/${productId}`);
        this.cartItems = response.data;
      } catch (error) {
        console.error('Error removing item from cart:', error);
        this.error = 'Failed to remove item from the cart.';
      } finally {
        this.isLoading = false;
      }
    },

    async fetchData() {
      this.isLoading = true;
      try {

        const userId = this.userId;
        const response = await api.get(`/api/users/${userId}/cart`);
        this.cartItems = response.data;
      } catch (error) {
        console.error('Error fetching cart items:', error);
        this.error = 'Failed to fetch cart items.';
      } finally {
        this.isLoading = false;
      }
    },

  }
}
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