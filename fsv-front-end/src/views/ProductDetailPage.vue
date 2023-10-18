<template>
  <div id="page-wrap">
    <div id="img-wrap">
      <img v-if="localProduct" :src="localProduct.imageUrl">
    </div>
    <div id="product-details">
      <h1>{{ localProduct ? localProduct.name : 'Loading...' }}</h1>
      <h3 id="price">$ {{ localProduct ? localProduct.price : 'Loading...' }}</h3>
      <p v-if="localProduct">Average rating: {{ localProduct.averageRating }}</p>
      <button
          class="add-to-cart"
          v-if="localProduct "
          @click="addToCart(localProduct)"
      >
        Add to Cart
      </button>
      <button
          class="green-button add-to-cart"
          v-if="localProduct && showSuccessMessage"
          disabled
      >
        Successfully added item to cart!
      </button>
      <h4 v-if="localProduct">Description</h4>
      <p v-if="localProduct">{{ localProduct.description }}</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import api from '@/api/api';

export default {
  name: "ProductDetailPage",
  props: ['productId', 'userId'], // Accept userId as a prop
  data() {
    return {
      localProduct: {
        imageUrl: '',
      },
      email: "",
      password: "",
      showSuccessMessage: false,
      userCartItems: [],
      isLoading: true,
      cartTotal: 0,
      cartItems: [],
    }
  },
  computed: {
    ...mapState({
      userEmail: 'user.email',
      userPassword: 'user.password',
    }),
    ...mapGetters(['isAuthenticated', 'getName', 'getUserId' ]),
    itemsIsInCart() {
      return this.userCartItems.includes(this.localProduct.id);
    },
  },
  methods: {
    async addToCart(localProduct) {
      if (!this.isAuthenticated) {
        console.error("User is not authenticated. Please log in.");
        return;
      }

      const email = this.userEmail || localStorage.getItem('userEmail');
      const password = this.userPassword || localStorage.getItem('userPassword');
      const id = this.userId || localStorage.getItem('userId')

      try {
        const response = await api.post('/api/cart/add', {
          email: email,
          password: password,
          userId: id,
          productId: localProduct.id,
        });

        if (response.status === 200) {
          this.showSuccessMessage = true;
          this.fetchUserCart();

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
    async fetchUserCart() {
      try {

        const userId = this.userId;
        const response = await api.get(`/api/users/${userId}/cart`);

        if (response.status === 200) {
          this.userCartItems = response.data;
        } else {
          console.error("Failed to fetch user cart items from the server");
        }
      } catch (error) {
        console.error("Failed to fetch user cart items:", error);
      }
    },
  },
  async created() {
    try {
      const productId = Number(this.productId || this.$route.params.productId);
      const userId = this.$route.params.userId;
      console.log('the userId is ' , userId)
      const productResult = await api.get(`/api/products/${productId}/${userId}`);
      this.localProduct = productResult.data;
      this.isLoading = false;
    } catch (error) {
      console.error('An error occurred while fetching data:', error);
    }
  },
};
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