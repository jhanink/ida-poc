<template>
  <div id="app">
    <div id="fake-header">
      <img src="./assets/fake-header.png" width="100%"/>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
html, body {
  display: flex;
  flex-flow: column;
  height: 100%;
  margin: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}

#fake-header {
  position:fixed;
  top:0;
  height: 45px;
}

#fake-header img {
  height: 39px;
  width: auto;
}
</style>
