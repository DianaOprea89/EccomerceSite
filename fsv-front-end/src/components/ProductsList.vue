<template>
  <div v-if="products.length > 0">
    <products-list-item
        v-for="product in products"
        :key="product.id"
        :product="product"
        @remove-from-cart="removeFromCart(product.id)"
    ></products-list-item>
  </div>
  <p v-else>You haven't added anything to your cart yet</p>


</template>

<script>
import ProductsListItem from "@/components/ProductsListItem";

export default {
  name: "ProductsList",
  components: { ProductsListItem },
  props: ['products'],
  methods: {
    removeFromCart(productId) {
      // Emit the event with the product ID to notify the parent component
      this.$emit('remove-from-cart', productId);
    },
  },
};
</script>

<style scoped>

</style>