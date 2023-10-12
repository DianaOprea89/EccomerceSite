<template>
  <div id="page-wrap">
    <h1>Shopping Cart</h1>
    <ProductsList
        :products="cartItems"
        @remove-from-cart="removeFromCart"
    ></ProductsList>

    <div>
      <h3 id="total-price" v-if="cartItems.length>0">Total: ${{ cartTotal }}</h3>
      <button id="checkout-button">Proceed to Checkout</button>
    </div>
  </div>
</template>

<script>
import api from "@/api/api";
import ProductsList from "@/components/ProductsList";
import { mapGetters } from "vuex";

export default {
  name: "CartPage",
  components: { ProductsList },
  props: ["userId"],
  data() {
    return {
      isLoading: false,
      error: null,
    };
  },
  computed: {
    ...mapGetters(["cartItems"]),
    cartTotal() {
      return this.$store.getters.cartTotalPrice;
    },
  },
  async created() {
    await this.fetchData();
  },
  methods: {
    async removeFromCart(productId) {
      this.isLoading = true;
      try {
        await api.delete(`/api/users/${this.userId}/cart/${productId}`);
        this.$store.commit('UPDATE_CART', this.cartItems.filter(item => item.id !== productId));
        localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
      } catch (error) {
        console.error('Error removing item from cart:', error);
        this.error = 'Failed to remove item from the cart.';
      } finally {
        this.isLoading = false;
      }
    },
    async fetchUserData() {
      try {
        await this.$store.dispatch('loadUserData');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    },
    async fetchProductData() {
      try {
        await this.$store.dispatch('loadProducts');
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    },
    async getProductDetails(productId) {
      try {
        const productDetails = this.$store.state.products.find(product => product.id === productId);

        if (!productDetails) {
          return { name: 'Product Not Found', price: 0, imageUrl: '' };
        }

        return productDetails;
      } catch (error) {
        console.error('Error fetching product details:', error);
        throw error;
      }
    },
    async fetchData() {
      this.isLoading = true;
      try {
        await this.fetchUserData();
        await this.fetchProductData();

        const userId = this.userId;

        const response = await api.get(`/api/users/${userId}/cart`);

        if (response.data && Array.isArray(response.data)) {
          const productCounts = {};
          response.data.forEach((product) => {
            const productId = product.id;
            productCounts[productId] = (productCounts[productId] || 0) + 1;
          });

          const productsWithDetails = await Promise.all(
              Object.entries(productCounts).map(async ([productId, count]) => {
                const details = await this.getProductDetails(productId);
                return {
                  id: productId,
                  count,
                  price: details.price,
                  name: details.name,
                  imgUrl: details.imageUrl
                };
              })
          );

          this.$store.dispatch('updateCart', productsWithDetails);
        } else {
          console.warn("No cart data found.");
          this.$store.dispatch('updateCart', []);
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
        this.error = 'Failed to fetch cart items.';
      } finally {
        this.isLoading = false;
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