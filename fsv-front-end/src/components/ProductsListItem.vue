<template>
  <div class="product-container">
    <img class="product-image" :src="getImageUrl(product.product.imageUrl)">
    <div class="details-wrap">
      <h3>{{ product.product.name }}</h3>
      <p>$ {{ product.product.price }}</p>
    </div>
    <div class="actions-wrap">
      <span>Qty</span>
      <p class="counting">{{ product.count }}</p>

      <p >
          <span>
               <i class="arrow up" @click="handleAddtoCart(product.product.id)"></i>
               <i class="arrow down"  @click="handleRemoveFromCart(product.product.id)"></i>
         </span>
      </p>
      <button class="remove-button remove-text" @click="handleRemoveFromCart(product.product.id)">
        Remove item from cart
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductsListItem",
  props: {
    product: {
      type: Object,
      required: true
    },
  },
  methods: {
    handleRemoveFromCart(productId) {
      console.log("Removing from cart in ProductListItem with productId:", productId);
      this.$emit("remove-from-cart", productId);
    },
    handleAddtoCart(productId) {
      console.log("Adding to cart in ProductListItem with productId:", productId);
      this.$emit("add-to-cart", productId);
    },
    getImageUrl(imagePath) {
      return `/assets${imagePath}`;
    }
  },
};
</script>


<style scoped>
.product-container {
  align-items: center;
  border-bottom: 1px solid #ddd;
  display: flex;
  padding: 16px;
  align-items: center;
  width: 100%;
}

.product-image {
  flex-shrink: 0;
  height: 100px;
  max-width: 100px;
  margin-right: 10px;
}

.details-wrap {
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.up {
  transform: rotate(-135deg);
  -webkit-transform: rotate(-135deg);
}
.arrow {
  border: solid black;
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 3px;
}
.down {
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
}
.actions-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}

.actions-wrap .counting {
  width: 35px;
  height: 30px;
  padding: 3px;
  text-align: center;
  border: 2px black solid;
}

.details-wrap h3, .details-wrap p {
  margin: 0;
}


.actions-wrap .remove-button {
  background-color: #f6b2be;
  flex-grow: 1;
  color: #797575;
  border: none;
  padding: 5px 10px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.remove-button:hover {
  background-color: darkred;
}

.remove-text {
  font-size: 0.9rem;
  cursor: pointer;
  padding: 5px 10px;
  background-color: rgb(251, 241, 241);
  display: inline-block;
}


</style>