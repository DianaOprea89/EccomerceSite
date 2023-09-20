<template>
  <div id="page-wrap" v-if="product">
    <div id="img-wrap">
      <img :src="product.imageUrl">
    </div>
    <div id="product-details">
      <h1>{{product.name}}</h1>
      <h3 id="price">$ {{product.price}}</h3>
      <p>Average rating :{{product.averageRating}}</p>
      <button
          class="add-to-cart"
          v-if="!itemsIsInCart && !showSuccesMessage"
          v-on:click="addToCart"
      >Add to cart</button>
      <button

          class="green-button add-to-cart"
          v-if="!itemsIsInCart &&  showSuccesMessage"
      > Successfully added item to cart!</button>
      <button

          class="grey-button add-to-cart"
          v-if="itemsIsInCart"

      >Item is already in cart!</button>
      <h4>Description</h4>
      <p>{{product.description}}</p>
    </div>
  </div>
  <not-found-page v-else></not-found-page>
</template>

<script>
import api from "@/api/api";
import NotFoundPage from "@/views/NotFoundPage";

export default {
  name: "ProductDetailPage",
  components: { NotFoundPage },
  data() {
    return {
      product: {},
      cartItems: [],
      showSuccesMessage: false,
      productIsAdded: false,
    };
  },
  computed: {
    itemsIsInCart() {
      return this.cartItems.some(item => item.id === this.product.id);
    },
  },
  methods: {
    async addToCart() {
      const productId = this.$route.params.id;
      const token = localStorage.getItem('token');
      const loggedInUser = this.$store.getters.loggedInUser;

      try {
        await api.post(`/api/users/${loggedInUser.id}/cart`, { productId }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Product added to cart successfully');
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error('Unauthorized: Check token and user permissions');
        } else {
          console.error('Error adding product to cart:', error.response || error);
        }
      }
    },
  },
  async created() {
    const { data: product } = await api.get(`/api/products/${this.$route.params.id}`);
    this.product = product;

    if (this.$store.getters.isAuthenticated) {
      const loggedInUser = this.$store.getters.loggedInUser;
      console.log('loggedInUser:', loggedInUser);

      try {
        const { data: cartItems } = await api.get(`/api/users/${loggedInUser.id}/cart`);
        this.cartItems = cartItems;
      } catch (error) {
        console.error('Error fetching cart items:', error.message);
      }
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
