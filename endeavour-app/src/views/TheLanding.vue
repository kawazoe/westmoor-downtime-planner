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
        <h3>The most versatile tool for RPG Campaign management</h3>
        <p>
          Endeavourapp.io is a completely configurable tool to help you deal with the most complex RPG campaigns you can
          think of. It was build from the ground up to handle anything from the simplest, 3 or 4 players, once in a
          month, couch session all the way to massive 20+ player endeavours like a Westmarch hex-crawl with multiple
          sessions a week.
        </p>
      </section>
    </div>

    <div class="hero hero-right">
      <img src="../assets/placeholder.png" alt="placeholder">
      <section>
        <h3>Focus on the game, not on the grind</h3>
        <p>
          A lot of RPG campaigns will feature downtime activities that the player can do in between chapters. Taking
          care of those can be very time consuming for a Dungeon Master and players and some of them need to be in
          private or in groups, might have various associated costs and take time. Never forget that magic item one of
          your player started to work on 3 months ago again.
        </p>
      </section>
    </div>

    <div class="hero hero-left">
      <img src="../assets/placeholder.png" alt="placeholder">
      <section>
        <h3>Go further, where you never dared before</h3>
        <p>
          Have you already considered how interesting it would be to have a real market simulation in your games only to
          realize how insane that would be to manage on your own? Maybe now is the time to consider again.
          Endeavourapp.io comes with the ability to define factions and mints of varying values while tracking the price
          of every item in you campaign across multiple world changing events.
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
        <h3>Factions and resources</h3>
        <p>
          In here, everything can be a tradeable resource. If more political campaigns are your jam, you can use
          endeavourapp.io to manage your player's relationship and allegiance to factions and see how it will sway the
          balance of power in your world.
        </p>
      </section>
    </div>

    <div class="hero hero-right">
      <img src="../assets/placeholder.png" alt="placeholder">
      <section>
        <h3>The DM isn't the only writer in this story</h3>
        <p>
          Role Playing Games are known to be a great collaborative story-writing experience, but often, it is the DM
          that do all the writing, with the players doing all the telling... Endeavourapp.io is meant to be used
          collaboratively, with all players on deck. As a DM, you get to give them as much power as you want, from
          viewing only to full self-service downtime actions.
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
