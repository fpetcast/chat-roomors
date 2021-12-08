<template>
  <Room />
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'
import Room from './components/Room.vue'
// import EnterChat from './components/EnterChat.vue'

export default {
  name: 'App',
  components: {
    Room
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
