<template>
  <div class="loaderWrap" role="status" aria-live="polite">
    <div class="ball" />
    <div class="text">
      <slot>Loading Pokédex…</slot>
    </div>
  </div>
</template>

<style scoped>
.loaderWrap {
  position: fixed;
  inset: 0;
  display: grid;
  place-content: center;
  gap: var(--ds-space-lg);

  background: var(--ds-overlay);
  backdrop-filter: blur(6px);
  z-index: 9999;
}

/* Pokéball */
.ball {
  width: 96px;
  height: 96px;
  border-radius: var(--ds-radius-pill);
  background: linear-gradient(#e53935 0 48%, #111 48% 52%, #f5f5f5 52% 100%);
  position: relative;
  box-shadow: var(--ds-shadow-sm);

  /* langsamer & ruhiger */
  animation: wobble 2200ms ease-in-out infinite;
}

.ball::before {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: 26px;
  height: 26px;
  border-radius: 999px;
  transform: translate(-50%, -50%);
  background: #f5f5f5;
  border: 6px solid #111;
  box-sizing: border-box;
}

/* Text */
.text {
  color: var(--ds-text);
  font-size: var(--ds-font-size-md);
  text-align: center;

  /* sanftes "Atmen" */
  animation: fade 2400ms ease-in-out infinite;
}

/* Animationen */
@keyframes wobble {
  0% {
    transform: rotate(-8deg) translateY(0);
  }
  25% {
    transform: rotate(8deg) translateY(-2px);
  }
  50% {
    transform: rotate(-8deg) translateY(0);
  }
  100% {
    transform: rotate(-8deg) translateY(0);
  }
}

@keyframes fade {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}
</style>
