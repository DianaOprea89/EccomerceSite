<template>
  <div id="app">
    <nav-bar></nav-bar>
    <router-view/>
  </div>
</template>


<style>
* {
  box-sizing: border-box;
  font-family: Arial;
}

#page-wrap {
  margin: auto;
  max-width: 800px;
  min-height: 100vh;
}

button {

  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  outline: 0;
  padding: 16px;
}
</style>

<script>
import NavBar from "@/components/NavBar";
export default {
  name:'App',
  components: {NavBar}
}
</script>