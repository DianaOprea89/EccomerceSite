<template>
  <div v-if="products.length > 0">
    <ProductsListItem
        v-for="product in products"
        :key="product.id"
        :product="product"
        :product-quantity="productQuantities[product.id] || 1"
        @remove-from-cart="() => removeFromCart(product.id)"
        @update-cart-item-quantity="updateCartItemQuantity"
    ></ProductsListItem>
  </div>
  <p v-else>You haven't added anything to your cart yet</p>
</template>




<script>
import ProductsListItem from "@/components/ProductsListItem";

export default {
  name: "ProductsList",
  components: { ProductsListItem },
  props: {
    products: Array,
    productQuantities: Object,
    quantity:Number,
  },
  methods: {
    removeFromCart(productId) {
      this.$emit("remove-from-cart", productId);
    },
    updateCartItemQuantity({ id, quantity }) {
      this.$emit("update-cart-item-quantity", { id, quantity });
    },
  },
  watch: {
    products: function () {
      console.log(this.products);
    }
  }
};
</script>


<style scoped>

</style>