<template>
  <h2>The Player Page</h2>

  <div id="nav">
    <router-link to="/player/characters">Characters</router-link>
  </div>

  <router-view/>
</template>

<script>
export default { name: 'ThePlayer' };
</script>

<style scoped>

</style>
