<template>
  <div class="wrap" role="status" aria-label="Loading">
    <div class="ball" />
    <div class="text">Loading Pokédex…</div>
  </div>
</template>

<style scoped>
.wrap {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(6px);
  z-index: 9999;
}
.ball {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  background:
    radial-gradient(
      circle at 50% 50%,
      #fff 0 14%,
      #111 14% 18%,
      transparent 18%
    ),
    linear-gradient(#e53935 0 50%, #fff 50% 100%);
  border: 6px solid #111;
  position: relative;
  animation: bounce 1s infinite ease-in-out;
}
.ball::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 6px;
  background: #111;
  transform: translateY(-50%);
}
.text {
  color: #fff;
  font-weight: 600;
}
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(6deg);
  }
}
</style>
