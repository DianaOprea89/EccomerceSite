<template>
  <div class="product-item">
    <img :src="getImageUrl(product.imageUrl)">
    <h3 class="product-name">{{ product.name }}</h3>
    <p class="product-price">$ {{ product.price }}</p>
    <router-link :to="'/products/' + product.id + '/' + userId" @click="logRoute">
      <button>View Details</button>
    </router-link>




  </div>
</template>

<script>
export default {
  name: "ProductsGridItem",
  props: ["product", "userId"],
  methods: {
    logRoute() {
      console.log("Navigating to route with userId:", this.userId);
      console.log(this.product)
    },
    getImageUrl(imagePath) {
      return `/assets${imagePath}`;
    }

  }

};
</script>



<style scoped>

.product-item {
  align-items: center;
  border-radius: 8px;
  box-shadow: 0px 2px 5px #888;
  display: flex;
  flex-direction: column;
  margin-bottom: 2%;
  padding: 20px;
  position: relative;
  width: 32%;
}

.product-name {
  margin-bottom: 0;
}

img {
  height: 200px;
  width: 200px;
}

a {
  width: 100%;
}

button {
  width: 100%;
}
</style>
