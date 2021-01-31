<template>
  <header>
    <nav>
      <ul>
        <li><router-link to="/">Landing</router-link></li>
        <li><router-link to="/campaigns">Campaigns</router-link></li>
        <li><router-link to="/player">Player</router-link></li>
        <li><router-link to="/tos">Terms of Service</router-link></li>
      </ul>
    </nav>
  </header>

  <main>
    <router-view/>
  </main>
</template>

<style lang="scss" module>
body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
<script>
export default { components: {} };
</script>
