<script setup lang="ts">
import { Button } from 'primevue';
import { type Post } from '~/types/Post'

const query = groq`*[ _type == "post" && defined(slug.current) ] | order(_createdAt desc)`
const { data: posts } = await useSanityQuery<Post[]>(query)
</script>

<template>
  <div class="header-wrapper">
    <div class="header-container">

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
        <p class="wall-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sed odio in nunc sodales iaculis. Quisque scelerisque fermentum turpis cursus venenatis. Vestibulum semper sem in laoreet mattis. Nulla et vestibulum sem, sed sollicitudin arcu. Cras nunc dolor, pretium eu porttitor pretium, semper ut magna. Praesent euismod mauris non justo fringilla accumsan. In malesuada rutrum rhoncus. Sed quis lacinia erat. Mauris interdum gravida nibh a pharetra. Quisque in rutrum nunc. Donec vulputate sit amet velit pretium molestie. Integer vitae magna quis risus luctus iaculis. </p>

      </div>
    </div>
  </div>

  
  <img src="/assets/icons/prijelaz-zid-plaza.svg" alt="prijelaz-zid-plaza" class="prijelaz-zid-plaza-icon" />

  <div class="prijelaz-divider"></div>

</template>

<style scoped>
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

.header-date{
  font-family: "Bright";
  color: #EFE5DD;
  font-size: 1rem;
  text-align: center;
  margin: 0;
  padding: 0;
}

/*  --------------- WALL --------------- */

.wall-divider{
  background-color: #E55A8E;
  width: 100%;
  height: 1rem;
}

.wall-wrapper{
  background-color: #DD7D91;
  height: fit-content;
  width: 100%;

  display: flex;
  justify-content: center;
  flex-direction: row;

  background-image: url('/assets/icons/zid-tekstura.svg');
  background-repeat: repeat;
  background-size: contain; 
}

.wall-container{
  width: 90%;
}

.wall-text{
  width: 100%;
}

.title-text{
  font-size: 1.5rem;
  font-weight: bold;
}

.prijelaz-divider {
  height: 4.5rem;
  width: 100%;
  background-image: url('/assets/icons/prijelaz-zid-plaza.svg');
  background-repeat: no-repeat;
  background-size: 100% 100%; /* stretch only vertically */
  background-position: center;
}

</style>
