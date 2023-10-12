<template>
  <div id="page-wrap">
    <div id="img-wrap">
      <img v-if="product" :src="product.imageUrl">

    </div>
    <div id="product-details">
      <h1>{{ product ? product.name : 'Loading...' }}</h1>
      <h3 id="price">$ {{ product ? product.price : 'Loading...' }}</h3>
      <p v-if="product">Average rating: {{ product.averageRating }}</p>


      <button
          class="add-to-cart"
          v-if="product "
          @click="addToCart(product)"
      >
        Add to Cart
      </button>
      <button
          class="green-button add-to-cart"
          v-if="product && showSuccessMessage"
          disabled
      >
        Successfully added item to cart!
      </button>
      <h4 v-if="product">Description</h4>
      <p v-if="product">{{ product.description }}</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import api from "@/api/api";
import { calculateTotalPrice } from "@/cartUtils.js";




export default {
  name: "ProductDetailPage",
  props: ['productId'],
  data() {
    return {
      product: {
        imageUrl: '',
      },
      email: "",
      password: "",
      showSuccessMessage: false,
      userCartItems: [],
      isLoading: true,
      cartTotal: 0,
    };
  },
  computed: {
    ...mapState({
      userEmail: 'user.email',
      userPassword: 'user.password',
    }),
    ...mapGetters(['isAuthenticated', 'getName', 'getUserId','cartItems']),
    itemsIsInCart() {
      return this.userCartItems.includes(this.product.id);
    },
  },
  watch: {
    cartItems: {
      handler(newCartItems) {
        this.cartTotal = calculateTotalPrice(newCartItems);
      },
      deep: true,
    },
  },
  methods: {
    async addToCart(product) {
      if (!this.isAuthenticated) {
        console.error("User is not authenticated. Please log in.");
        return;
      }
      const email = this.userEmail || localStorage.getItem('userEmail');
      const password = this.userPassword || localStorage.getItem('userPassword');

      try {
        const response = await api.post('/api/cart/add', {
          email: email,
          password: password,
          productId: this.product.id,
        });

        if (response.status === 200) {
          const newItem = {
            count: 1, // You can modify this as needed
            id: product.id,
            price: product.price,
            name: product.name
          }
          this.$store.commit('UPDATE_CART', newItem); // Commit the mutation
          const cartArray = Object.values(this.cartItems); // Use this.cartItems
          localStorage.setItem('cartItems', JSON.stringify(cartArray));
          this.showSuccessMessage = true;
          this.userCartItems.push(product.id);

          setTimeout(() => {
            this.showSuccessMessage = false;
          }, 3000);
        } else {
          console.error("Failed to add to cart on the server");
        }
      } catch (error) {
        console.error("Failed to add to cart:", error);
        if (error.response && error.response.data) {
          console.error("Error details:", error.response.data);
        }
        this.showSuccessMessage = false;
      }
    },
  },
  async created() {
    try {

      const productId = Number(this.productId || this.$route.params.id);
      const productResult = await api.get(`/api/products/${productId}`);
      this.product = productResult.data;

      const storedCartItems = localStorage.getItem('cartItems');
      console.log('Stored Cart Items:', storedCartItems);
      if (storedCartItems) {
        let cartArray = JSON.parse(storedCartItems);

        if (!Array.isArray(cartArray)) {
          // If it's not an array, convert it to an array
          cartArray = Object.values(cartArray);
        }

        // Now you can use map safely
        this.$store.commit('UPDATE_CART', cartArray);
        this.userCartItems = cartArray.map(item => item.id);
      }

      this.isLoading = false;
    } catch (error) {
      console.error('An error occurred while fetching data:', error);
    }
  }
}



</script>

<style scoped>
#page-wrap {
  margin-top: 16px;
  padding: 16px;
  max-width: 600px;
}

#img-wrap {
  text-align: center;
}

img {
  width: 400px;
}

#product-details {
  padding: 16px;
  position: relative;
}

.add-to-cart {
  width: 100%;
}

#price {
  position: absolute;
  top: 24px;
  right: 16px;
}

.green-button {
  background-color: green
}

.grey-button {
  background-color: gray;
}
</style>