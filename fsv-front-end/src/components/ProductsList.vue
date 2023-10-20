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

    handleRemoveFromCart(productId) {
      console.log("Removing from cart in ProductsList:", productId);
      this.$emit("remove-from-cart", productId);
    },
  },
  created() {
    console.log("ProductsList created with products:", this.products);
  },
  watch: {
    products: function (newProducts, oldProducts) {

      console.log("Products prop changed:", newProducts, oldProducts);
    },
  },
};
</script>




<style scoped>

</style>