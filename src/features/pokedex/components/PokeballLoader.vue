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

.ball {
  width: 96px;
  height: 96px;
  border-radius: var(--ds-radius-pill);
  background: linear-gradient(#e53935 0 48%, #111 48% 52%, #f5f5f5 52% 100%);
  position: relative;
  animation: wobble 2200ms cubic-bezier(0.45, 0, 0.55, 1) infinite;
  box-shadow: var(--ds-shadow-sm);
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

.text {
  color: var(--ds-text);
  font-size: var(--ds-font-size-md);
  opacity: 0.9;
  text-align: center;
}

@keyframes wobble {
  0%,
  100% {
    transform: rotate(-8deg) translateY(0);
  }
  50% {
    transform: rotate(8deg) translateY(-2px);
  }
}
</style>
