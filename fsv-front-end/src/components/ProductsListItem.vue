<template>
  <div class="product-container">
    <img class="product-image" :src="product.product.imageUrl">
    <div class="details-wrap">
      <h3>{{ product.product.name }}</h3>
      <p>$ {{ product.product.price }}</p>
    </div>
    <div class="actions-wrap">
      <span>Qty</span>
      <input type="number" v-model="quantity" @input="updateQuantity" />
      <button class="remove-button remove-text" @click="removeFromCart(product.product.id)">
        Remove from cart
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
    productQuantities: Number,
  },
  data() {
    return {
      quantity: this.productQuantities || 1,
    };
  },
  methods: {
    removeFromCart(productId) {
      this.$emit("remove-from-cart", productId);
    },
    updateQuantity() {
      // Emit an event to update the cart item quantity
      this.$emit("update-cart-item-quantity", {
        id: this.product.product.id,
        quantity: this.quantity,
      });
    },
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

.actions-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}

.details-wrap h3, .details-wrap p {
  margin: 0;
}

.actions-wrap input[type="number"] {
  width: 35px;
  text-align: center;
  border: 1px solid #ccc;
}

.actions-wrap .remove-button {
  background-color: #e15069;
  flex-grow: 1;
  color: white;
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