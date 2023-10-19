<template>
  <div v-if="products.length > 0">
    <ProductsListItem
        v-for="product in products"
        :key="product.id"
        :product="product"
        :product-quantity="productQuantities[product.id] || 1"
        @remove-from-cart="handleRemoveFromCart"

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
    quantity: Number,
  },
  methods: {
    // Handle the "remove-from-cart" event
    handleRemoveFromCart(productId) {
      // Emit an event to request removal of the product
      this.$emit("remove-from-cart", productId);
    },
  },
  created() {
    console.log("ProductsList created with products:", this.products);
  },
  watch: {
    products: function (newProducts, oldProducts) {
      // Log when the products prop changes
      console.log("Products prop changed:", newProducts, oldProducts);
    },
  },
};
</script>




<style scoped>

</style>