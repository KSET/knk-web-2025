<template>
  <div class="footer-wrapper">
    <div class="footer-container">
      <div class="logos">
        <img src="/assets/icons/SC-logo.svg" alt="logo" class="logo" />
        <img
          src="/assets/icons/KSET-logo.svg"
          alt="logo"
          class="logo"
          style="height: 5rem"
        />
        <img
          src="/assets/icons/krk-logo.svg"
          alt="logo"
          class="logo"
          style="height: 4rem"
        />
      </div>

      <p>Sva prava pridržana © 2025</p>
      <p>Savez studenata FER-a</p>
      <div class="footer-links">
        <NuxtLink to="/opca-pravila" class="" style="color: white"
          >Opća Pravila</NuxtLink
        >
        <NuxtLink to="/politika-privatnosti" class="" style="color: white"
          >Politika Privatnosti</NuxtLink
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.footer-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background-color: #264f6c;
}

.footer-container {
  max-width: 50rem;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 2rem 3rem 2rem;
}

.logo {
  border-radius: 0px;
  height: 3rem;
}

.logos {
  display: flex;
  align-items: center;
}

.footer-links {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
}
</style>
