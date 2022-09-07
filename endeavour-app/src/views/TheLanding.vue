<template>
  <main class="container px-8 sm:px-4 pb-16 text-center sm:text-left">
    <h2>Play D&D, don't manage spreadsheets</h2>

    <!--
    <app-binder-presenter :value="playersStore">
      <template v-slot:initial>
        Waiting...
      </template>
      <template v-slot:nested="{pages}">
        <div v-for="page in pages">
          <app-binder-page-presenter :value="page">
            <template v-slot:content="{value}">
            </template>
          </app-binder-page-presenter>
        </div>
        <div v-for="page in anyBookmarkKind.visible(pages)">
          <app-binder-page-presenter :value="page">
            <template v-slot:content="{value}">
            </template>
          </app-binder-page-presenter>
        </div>

        <div id="progressive">
          <button @click="progressive.trigger()"></button>
          <app-scroll-detector @reached="progressive.trigger()"></app-scroll-detector>
        </div>

        <div id="relative">
          <button @click="relative.go(relative.previous)">Previous</button>
          <button v-for="bookmark in relative" @click="relative.go(bookmark)" :class="bookmark === relative.current ? 'current' : ''">
            {{bookmark.title}}
          </button>
          <button @click="relative.go(relative.next)">Next</button>
        </div>

        <div id="absolute">
          <label>Offset:</label>
          <input type="number" @change="absolute.load($value, absolute.limit)" :value="absolute.offset">
          <label>Limit:</label>
          <input type="number" @change="absolute.load(absolute.offset, $value)" :value="absolute.limit">
        </div>
      </template>
    </app-binder-presenter>
    -->

    <app-binder-presenter :value="playersDataStore">
      <template #initial>
        <div ref="playersLoader">...</div>
      </template>
      <template #nested="{pages}">
        <p>binder</p>
        <ul class="text-4xl">
          <app-binder-page-presenter v-for="page in pages" :value="page" :key="page.key">
            <template #content>
              <li>page {{page.bookmark?.page}}</li>
              <li v-for="player in page.value" :key="player.cid"><a class="nav-link" href="#" @click="setPlayer(player)">{{player.summary}}</a></li>
            </template>
          </app-binder-page-presenter>
        </ul>
        <div ref="playersLoader">...</div>
      </template>
    </app-binder-presenter>

    <div class="hero hero-left">
      <img src="../assets/placeholder.png" alt="placeholder">
      <section>
        <h3>The most versatile tool for Role-Playing Game campaign management</h3>
        <p>
          Endeavourapp.io is a completely configurable tool to help you deal with the most complex RPG campaigns you can
          think of. It was build from the ground up to handle anything from the simplest, 3 or 4 players, once a month,
          couch session all the way to massive 200+ players endeavours like a Westmarch hex-crawl with multiple
          sessions a week. Whether you just want to have a place to play with your friends, or dream of a massively
          multiplayer campaign coupled with asynchronous role playing, we've got you covered.
        </p>
      </section>
    </div>

    <div class="hero hero-right">
      <img src="../assets/placeholder.png" alt="placeholder">
      <section>
        <h3>Focus on the game, not on the grind</h3>
        <p>
          A lot of RPG campaigns will feature downtime activities that the player can do in between sessions or chapters.
          Taking care of those can be very time consuming for Game Masters and players alike. Sometimes, you might need
          to host mini sessions, either private or in group, to accomplish them. They might have various costs associated
          to each of them and take time to accomplish. Magic items found by characters 3 months ago might also impact
          those downtime activities. Keeping track of all of this can be a real grind. Thankfully, endeavourapp.io will
          not only handle all of this for you, it will also let you create your own activities as needed.
        </p>
      </section>
    </div>

    <div class="hero hero-left">
      <img src="../assets/placeholder.png" alt="placeholder">
      <section>
        <h3>Go further, where you never dared before</h3>
        <p>
          Have you already considered how interesting it would be to have a real market simulation in your games only to
          realize how insane it would be to manage on your own? Maybe now is the time to consider again.
          Endeavourapp.io comes with the ability to define factions and mints of varying values while tracking the price
          of every item in you campaign across multiple world changing events. Someone raided a local potion producing
          town? The simulated demand will cause prices to go up in the region until the town recovers. Your adventurers
          finally cleaned up that old mine from an ooze infestation? The simulated offer will flood the market with new
          jobs and ores making weapons and armors more affordable.
        </p>
      </section>
    </div>

    <div class="hero hero-right">
      <img src="../assets/placeholder.png" alt="placeholder">
      <section>
        <h3>Stop carrying all of your pocket change</h3>
        <p>
          Endeavourapp.io can act as a bank for your campaign, giving a place for your players to store money or
          valuable items between adventures. Besides preventing holes in their pockets, this is a great way to handle
          rules like the cost of living in D&D 5e, completely automatically.
        </p>
      </section>
    </div>

    <div class="hero hero-left">
      <img src="../assets/placeholder.png" alt="placeholder">
      <section>
        <h3>Factions and influence</h3>
        <p>
          If more political campaigns are your jam, you can use endeavourapp.io to manage your player's relationship and
          allegiance to factions. See how they sway the balance of power in your world and create twisted political
          dynamics between players that carouses with mutual enemies. Use these allegiances as resources for actions to
          build a complex network of political possibilities for your players.
        </p>
      </section>
    </div>

    <div class="hero hero-right">
      <img src="../assets/placeholder.png" alt="placeholder">
      <section>
        <h3>The DM isn't the only writer in this story</h3>
        <p>
          Role Playing Games are known to be great collaborative story-writing experiences, but often, it is the GM
          that does all the writing with the players doing all the telling... Endeavourapp.io is meant to be used
          collaboratively, with all players on deck. As a GM, you get to give them as much power as you want, from
          viewing only to full self-service campaigns like in ye old forum days. Whether you want to share your amazing
          story with the world, or test drive a new module on your own, the decision is yours.
        </p>
      </section>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import { usePlayersCurrentStore, usePlayersDataStore } from '@/stores';
import { useIntersectionObserver } from '@/composables/intersectionObservers';

import type { PlayerEntity } from '@/stores/businessTypes';

import AppBinderPagePresenter from '@/components/AppBinderPagePresenter';
import AppBinderPresenter from '@/components/AppBinderPresenter';

const playersDataStore = usePlayersDataStore();
const enumerablePlayers = playersDataStore.bind();
const playerStore = usePlayersCurrentStore();

const playersLoader = ref<HTMLElement | null>(null);
useIntersectionObserver(playersLoader, e => e.isIntersecting && enumerablePlayers.next().then(() => !playersDataStore.currentPage?.metadata.last));

function setPlayer(player: PlayerEntity): void {
  sessionStorage.setItem('current-player', player.cid);
  playerStore.trigger();
}
</script>

<style scoped>
.hero { @apply flex items-center my-8; }
.hero-left { @apply flex-col sm:flex-row; }
.hero-right { @apply flex-col sm:flex-row-reverse; }

h2 { @apply mt-8 sm:mt-48 mb-8 sm:mb-16 text-2xl; }
h3 { @apply my-2 text-xl; }
p { @apply mb-2 text-justify; }
img { @apply w-64 h-64; }

.hero-left section { @apply sm:ml-8; }
.hero-right section { @apply sm:mr-8; }

.nav-link {
  @apply hover:text-primary-light;
}
</style>
