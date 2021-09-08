<template>
  <footer class="bg-primary-dark text-gray-100">
    <div class="container flex flex-col sm:flex-row justify-around px-4 pt-6 pb-12">
      <div class="flex flex-col mb-6 sm:mb-0">
        <h2 class="mb-2">Check our stuff out:</h2>
        <ul>
          <li>
            <app-icon class="fa-w-20" :icon="faFacebookSquare"></app-icon>
            Facebook
          </li>
          <li>
            <app-icon class="fa-w-20" :icon="faGithubSquare"></app-icon>
            GitHub
          </li>
        </ul>
      </div>
      <div class="flex flex-col  mb-6 sm:mb-0">
        <h2 class="mb-2">Made by these folks:</h2>
        <ul>
          <li>
            <app-icon class="fa-w-20" :icon="faUser"></app-icon>
            Etienne Maheu
          </li>
          <li>
            <app-icon class="fa-w-20" :icon="faUsers"></app-icon>
            The Westmoor party
          </li>
        </ul>
      </div>
      <div class="flex flex-col  mb-6 sm:mb-0">
        <ul>
          <li>
            <router-link class="nav-link" to="/tos">Terms of Service</router-link>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import AppIcon from '@/components/AppIcon';

import { faFacebookSquare, faGithubSquare } from '@fortawesome/free-brands-svg-icons';
import { faUser, faUsers } from '@fortawesome/pro-solid-svg-icons';

export default defineComponent({
  name: 'TheFooter',
  components: { AppIcon },
  setup() {
    return { faFacebookSquare, faGithubSquare, faUser, faUsers };
  },
});
</script>

<style scoped>

</style>
