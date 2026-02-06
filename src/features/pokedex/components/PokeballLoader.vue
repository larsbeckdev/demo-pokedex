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
  gap: 16px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(6px);
  z-index: 9999;
}

.ball {
  width: 96px;
  height: 96px;
  border-radius: 999px;
  background: linear-gradient(#e53935 0 48%, #111 48% 52%, #f5f5f5 52% 100%);
  position: relative;
  animation: wobble 900ms ease-in-out infinite;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
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
  color: white;
  font-size: 14px;
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
