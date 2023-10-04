<template>
  <div id="page-wrap">
    <div id="img-wrap">


      <!-- <img :src="require(`../assets/${product.imageUrl}`).default"> -->
    </div>
    <div id="product-details">
      <h1>{{ product ? product.name : 'Loading...' }}</h1>
      <h3 id="price">$ {{ product ? product.price : 'Loading...' }}</h3>
      <p v-if="product">Average rating: {{ product.averageRating }}</p>

      <!-- Add to Cart Button -->
      <button
          class="add-to-cart"
          v-if="product && !itemsIsInCart && !showSuccessMessage"
          @click="addToCart(product)"
      >Add to Cart
      </button>
      <button
          class="green-button add-to-cart"
          v-if="product && !itemsIsInCart && showSuccessMessage"
      >Successfully added item to cart!
      </button>
      <button
          class="grey-button add-to-cart"
          v-if="product && itemsIsInCart"
      >Item is already in cart!
      </button>

      <!-- Product Description -->
      <h4 v-if="product">Description</h4>
      <p v-if="product">{{ product.description }}</p>
    </div>
  </div>
</template>


<script>
import { mapState, mapGetters } from 'vuex';
import api from "@/api/api";

export default {
  name: "ProductDetailPage",
  props: ['productId'],
  data() {
    return {
      product: null,
      email: "",
      password: "",
      showSuccessMessage: false,
      itemsIsInCart: false
    };
  },
  computed: {
    ...mapState({
      userEmail: 'user.email',
      userPassword: 'user.password'
    }),
    ...mapGetters(['isAuthenticated', 'getName', 'getUserId'])
  },
  methods: {
    async addToCart() {
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
          this.$store.dispatch('updateCart', response.data);
          this.showSuccessMessage = true;
          this.itemsIsInCart = true;

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
        this.itemsIsInCart = false;
      }
    }
    ,
    async fetchData() {
      try {
        const productId = Number(this.$route.params.id);
        const productResult = await api.get(`/api/products/${productId}`);
        this.product = productResult.data;


        const userCartResult = await api.get(`/api/users/${this.getUserId}/cart`);
        const userCartItems = userCartResult.data.map(item => item.id);


        this.itemsIsInCart = userCartItems.includes(this.product.id);

      } catch (error) {
        console.error("An error occurred while fetching data:", error);
      }
    }
  }
    ,
  async created() {
    try {
      const result = await api.get('/api/products/' + this.productId);
      console.log("Result:", result);
      const apiResult = result.data;
      this.product = apiResult;
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