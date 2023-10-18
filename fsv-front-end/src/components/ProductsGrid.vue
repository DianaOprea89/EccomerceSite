<template>
<div class="grid-wrap">
  <products-grid-item
      v-for="product in products"
      :key="product.id"
      :product="product"
      :user-id="userId"
  ></products-grid-item>
</div>
</template>
<script>
import ProductsGridItem from "@/components/ProductsGridItem";
export default {
  name: "ProductsGrid",
  components: {ProductsGridItem},
 props:['products','userId']
}
</script>
<style scoped>
.grid-wrap {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 16px;
}
</style>