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
        <div>
          <a
            href="https://web.facebook.com/events/1161949535664367"
            target="_blank"
            rel="noopener noreferrer"
            >facebook</a
          >
        </div>
        <div>
          <a
            href="https://www.instagram.com/klubkset"
            target="_blank"
            rel="noopener noreferrer"
            >instagram</a
          >
        </div>
        <div>
          <a href="mailto:knk@kset.org">knk@kset.org</a>
        </div>
        <div>
          <a href="mailto:info@kset.org">info@kset.org</a>
        </div>
      </div>

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
  justify-content: center;
  padding: 1rem 0;
  gap: 1rem;

  color: white;
}

.footer-links a {
  color: white;
}
</style>
