<template>
  <div id="page-wrap">
    <h1>Shopping Cart</h1>
    <div v-if="cartItems.length > 0">
      <ProductsList
          :products="cartItems"
          :product-quantities="productQuantities"
          @remove-from-cart="removeFromCart"
      ></ProductsList>
    </div>
    <p v-else>You haven't added anything to your cart yet</p>

    <div>
      <h3 id="total-price" v-if="cartItems.length > 0">Total: ${{ cartTotal }}</h3>
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
  props: ["userId", 'product'],
  data() {
    return {
      isLoading: false,
      cartItems: [],
      error: null,
      productQuantities: {}
    };
  },
  computed: {
    cartTotal() {
      const totalPrice = this.cartItems.reduce((accumulator, cartItem) => {
        const itemPrice = parseFloat(cartItem.product.price);
        if (!isNaN(itemPrice)) {
          return accumulator + itemPrice * cartItem.count;
        }
        return accumulator;
      }, 0);

      return totalPrice.toFixed(2);
    },
  },
  created() {
    this.fetchData();

    console.log('Product Quantities:', this.productQuantities);
  },

    methods: {
      async removeFromCart(productId) {
        console.log("Removing from cart in CartPage:", productId);
        this.isLoading = true;
        try {
          await api.delete(`/api/users/${this.userId}/cart/${productId}`);
          await this.fetchData();
        } catch (error) {
          console.error('Error removing item from cart:', error);
          this.error = 'Failed to remove item from the cart.';
        } finally {
          this.isLoading = false;
        }
      }
      ,
      async fetchData() {
        this.isLoading = true;
        try {
          const userId = this.$route.params.userId;
          const response = await api.get(`/api/users/${userId}/cart`);

          if (response.status === 200) {
            this.cartItems = response.data;
            this.cartItems.forEach((cartItem) => {
              this.productQuantities[cartItem.productId] = cartItem.count;
            });
          } else {
            console.warn("No cart data found.");
            this.cartItems = [];
          }
        } catch (error) {
          console.error('Error fetching cart items:', error);
          this.error = 'Failed to fetch cart items.';
        } finally {
          this.isLoading = false;
        }
      }
,
  },
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