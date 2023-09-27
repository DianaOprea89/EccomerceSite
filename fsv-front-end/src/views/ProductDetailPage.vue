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
      >Add to Cart</button>
      <button
          class="green-button add-to-cart"
          v-if="product && !itemsIsInCart && showSuccessMessage"
      >Successfully added item to cart!</button>
      <button
          class="grey-button add-to-cart"
          v-if="product && itemsIsInCart"
      >Item is already in cart!</button>

      <!-- Product Description -->
      <h4 v-if="product">Description</h4>
      <p v-if="product">{{ product.description }}</p>
    </div>
  </div>
</template>





<script>

import api from "@/api/api";

export default {
  name: "ProductDetailPage",
  props: ['productId'],
  data() {
    return {
      product: null,
    };
  },

  methods: {
    async addToCart(product) {
      if (!this.isAuthenticated) {
        console.error("User is not authenticated. Please log in.");
        return;
      }

      try {
        console.log("Adding to cart:", product);
        console.log("Product ID:", product.id);

        const response = await api.post('/api/cart/add', {
          email: this.user.email,
          password: this.user.password,
          productId: product.id
        });

        console.log("API response:", response); // Log the API response

        if (response.status === 200) {
          console.log("Product added to cart successfully on the server");

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
        this.showSuccessMessage = false;
        this.itemsIsInCart = false;
      }
    },
    async fetchData() {
      try {
        const productId = Number(this.$route.params.id);
        console.log("Product ID from route:", productId);

        const productResult = await api.get(`/api/products/${productId}`);
        this.product = productResult.data;

        // Log the retrieved product data
        console.log("Product data:", this.product);

        if (this.product.id === undefined) {
          console.error("Product ID is undefined in the fetched data.");
          return;
        }

        if (this.user && this.user.cartItems) {
          this.itemsIsInCart = this.user.cartItems.includes(this.product.id);
          console.log("Is in cart:", this.itemsIsInCart);
        }
      } catch (error) {
        console.error("An error occurred while fetching data:", error);
      }
    }

  },
  async created() {
    //alert(this.$route.params.id);
    // console.log("ProductDetailPage created hook");
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
.green-button{
background-color: green
}
.grey-button{
  background-color: gray;
}
</style>
