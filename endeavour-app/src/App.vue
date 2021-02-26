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

<script>
export default { components: {} };
</script>
