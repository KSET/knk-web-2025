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

</template>


<style scoped>
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

</style>