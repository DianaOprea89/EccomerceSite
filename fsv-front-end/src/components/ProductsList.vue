<template>

  <div v-if="products.length > 0">
    <products-list-item
        v-for="product in products"
        v-on:remove-from-cart="$emit('remove-from-cart',$event)"
        :key="product.id"
        :product="product">
    </products-list-item>
  </div>
  <p v-else>You haven't added anything to your cart yet</p>

</template>

<script>
import ProductsListItem from "@/components/ProductsListItem";


export default {
  name: "ProductsList",
  components: {ProductsListItem},
  props: ['products'],
  created() {
    console.log("Received products in ProductsList:", this.products);
  },
  computed: {
    cartItems() {
      return this.$store.getters.cartItems;
    },
  },


}
</script>

<style scoped>

</style>