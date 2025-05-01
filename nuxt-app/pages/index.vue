<script setup lang="ts">
import { Button } from 'primevue';
import { type Artist } from '~/types/Artist'

const query = groq`*[ _type == "artist"] | order(_createdAt desc)`
const { data: artists } = await useSanityQuery<Artist[]>(query)

console.log(artists)

import { ref } from 'vue';

const visibleRight = ref(false);

const toggleVisibleRight = (): void => {
  visibleRight.value = !visibleRight.value;
};


</script>

<template>
  <div class="header-wrapper">
    <div class="header-container">
      <img src="/assets/icons/burger.svg" alt="burger" @click="toggleVisibleRight" class="burger-icon"/>
      <div class="header-text-container">
        <p class="header-text">kset</p>
        <p class="header-text" style="text-align: center">na krku</p>
        <!-- <p class="header-text" style="text-align: end">2025</p> -->
        <img src="/assets/icons/2025.svg" alt="2025" class="2025-icon" style="align-self: flex-end;" />

      </div>

      <img src="/assets/icons/sunce.svg" alt="Sunce" class="sunce-icon" />
      <img src="/assets/icons/oblaci.svg" alt="oblaci" class="oblaci-icon" />

    </div>
    <p class="header-date">14.-16.8.2025.</p>
  </div>

  <div class="wall-divider" />
  <div class="wall-wrapper">
    <div class="wall-container">
      <div class="wall-text-container">
        <p class="title-text">O KNK-u</p>
        <p class="wall-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sed odio in nunc sodales
          iaculis. Quisque scelerisque fermentum turpis cursus venenatis. Vestibulum semper sem in laoreet mattis. Nulla
          et vestibulum sem, sed sollicitudin arcu. Cras nunc dolor, pretium eu porttitor pretium, semper ut magna.
          Praesent euismod mauris non justo fringilla accumsan. In malesuada rutrum rhoncus. Sed quis lacinia erat.
          Mauris interdum gravida nibh a pharetra. Quisque in rutrum nunc. Donec vulputate sit amet velit pretium
          molestie. Integer vitae magna quis risus luctus iaculis. </p>
      </div>

      <p class="title-text">Izvođači</p>

      <div class="artist-container">
        <div v-for="artist in artists">
          <img v-if="artist.image" :src="$urlFor(artist.image).url()" alt="artist image" class="artist-image" />
          <p>{{ artist.name }}</p>
        </div>
      </div>
    </div>

    <div class="prijelaz-container">
      <img src="/assets/prijelazi/prijelaz-zid-plaza.svg" alt="prijelaz-zid-plaza" class="prijelaz-zid-plaza" />
    </div>

  </div>



  <div class="beach-wrapper">
    <div class="beach-container">
      <p class="title-text">Raspored</p>

      <div class="artist-container">
        <div v-for="artist in artists">
          <img v-if="artist.image" :src="$urlFor(artist.image).url()" alt="artist image" class="artist-image" />
        </div>
      </div>
    </div>

    <div class="prijelaz-container">
      <img src="/assets/prijelazi/prijelaz-plaza-more.svg" alt="prijelaz-zid-plaza" />
    </div>
  </div>



  <div class="sea-wrapper">
    <div class="sea-container">
      <p class="title-text">Galerija</p>

      <Carousel :value="artists" :numVisible="2" :numScroll="1" :circular="true" :autoplayInterval="10000"
        :autoplay="true">
        <template #item="slotProps">
          <div class="gallery-container">
            <img v-if="slotProps.data.image" :src="$urlFor(slotProps.data.image).url()" alt="artist image"
              class="gallery-image" />
          </div>
        </template>
      </Carousel>
    </div>
  </div>

  <div class="prijelaz-container">
    <img src="/assets/prijelazi/prijelaz-more-dm.svg" alt="prijelaz-zid-plaza" style="background-color: #5C9C9C;" />
  </div>

  <Drawer v-model:visible="visibleRight" hedaer=" " position="right">
    <div class="drawer-wrapper">
      <div class="drawer-container">
        <div>
          <NuxtLink to="/" class="hover:underline drawer-text" style="color: #844D99">Naslovnica</NuxtLink>
        </div>
        <div>
          <NuxtLink to="/lineup" class="hover:underline drawer-text" style="color: #DD7D91">Izvođači</NuxtLink>
        </div>
        <div>
          <NuxtLink to="/gallery" class="hover:underline drawer-text" style="color: #E55A8E">Galerija</NuxtLink>
        </div>
      </div>

      <div class="drawer-footer">
        <img src="/assets/icons/stolica.svg" alt="stolica" class="stolica-icon" />
        <div class="zuta-podloga"></div>
      </div>
    </div>
  </Drawer>
</template>

<style>
:root {
  --p-carousel-indicator-active-background: #E55A8E !important;
}

.p-carousel-indicator-active .p-carousel-indicator-button {
  background-color: #E55A8E !important;
}

.p-drawer {
  background-color: #F7DEC0 !important;
}

.p-drawer-content {
  padding: 0 !important;
}
</style>

<style scoped>
.prijelaz-container {
  height: 4.5rem;
  width: 100%;
}

.prijelaz-container img {
  object-fit: fill;
  width: 100%;
  height: 4.5rem;
}

/*  --------------- HEADER --------------- */

.header-wrapper {
  background-color: #76C6D2;
  width: 100%;
  height: 15rem;
}

.header-container {
  position: relative;


  display: flex;
  justify-content: center;
  align-items: center;
  height: 90%;
}

.header-text-container {
  width: 65%;
  display: flex;
  flex-direction: column;
}

.header-text {
  position: relative;
  text-shadow: 3px 4px 0 #e4c9b3;

  font-size: 4rem;
  margin: 0;
  padding: 0;
  font-family: "Bright";
  color: #EFE5DD;
  z-index: 10;
}

.sunce-icon {
  position: absolute;
  top: 10%;
  left: 10%;
}

.oblaci-icon {
  position: absolute;
  top: 50%;
  width: 100%;
}

.header-date {
  font-family: "Bright";
  color: #EFE5DD;
  font-size: 1rem;
  text-align: center;
  margin: 0;
  padding: 0;
}

.burger-icon {
  position: absolute;
  right: 0%;
  top: 15%;
  cursor: pointer;
}


/*  --------------- WALL --------------- */

.wall-divider {
  background-color: #E55A8E;
  width: 100%;
  height: 1rem;
}

.wall-wrapper {
  background-color: #DD7D91;
  height: fit-content;
  width: 100%;

  display: flex;
  justify-content: center;
  flex-direction: column;

  background-image: url('/assets/icons/zid-tekstura.svg');
  background-repeat: repeat;
  background-size: contain;

  margin-bottom: -1px;
}

.prijelaz-zid-plaza {}

.wall-container {
  width: 100%;
  padding-left: 1rem;
}

.wall-text {
  width: 100%;
  padding-right: 1rem;
}

.title-text {
  font-size: 1.5rem;
  font-weight: bold;
}

.artist-container {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  overflow: auto;
  padding-right: 1rem;
  margin-bottom: 2rem;
}

.artist-image {
  width: 10rem;
  height: 10rem;
}


/*  --------------- BEACH --------------- */

.beach-wrapper {
  background-color: #F3D864;
  height: fit-content;
  width: 100%;

  display: flex;
  justify-content: center;
  flex-direction: column;
}

.beach-container {
  width: 100%;
  padding-left: 1rem;
}

/*  --------------- SEA --------------- */

.sea-wrapper {
  background-color: #5C9C9C;
  height: fit-content;
  width: 100%;

  display: flex;
  justify-content: center;
  flex-direction: column;
  padding-bottom: 2rem;
}

.sea-container {
  width: 100%;
  padding-left: 1rem;
}

.gallery-container {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  overflow: auto;
  padding-right: 1rem;
  justify-content: center;
}

.gallery-image {
  width: 10rem;
  height: 10rem;
}

/*  --------------- DRAWER --------------- */

.drawer-wrapper {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 60% 40%;
}

.drawer-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  height: 100%;
}

.drawer-text {
  font-family: "Montserrat";
  font-size: 1.5rem;
  text-align: center;
  margin: 0;
  padding: 0;
  text-decoration: none;
  text-transform: uppercase;
  font-weight: bold;
}

.drawer-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.stolica-icon {
  height: 80%;
  z-index: 10;
}

.zuta-podloga {
  background: #F3BB64;
  position: absolute;
  top: 70%;
  bottom: 0;
  left: 0;
  right: 0;
}


/*  --------------- RESPONNZIVNOST --------------- */

.wall-wrapper,
.beach-wrapper,
.sea-wrapper,
.header-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.wall-container,
.beach-container,
.sea-container,
.header-container {
  max-width: 50rem;
  width: 100%;
}
</style>
