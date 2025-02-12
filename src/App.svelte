<script lang="ts">
  import Icon from "@iconify/svelte";
  import confetti from "canvas-confetti"; // Import confetti library
  import { animate } from "motion";

  let money = $state(100);
  let icon = $state();
  let moneyContainer = $state();
  let progress = $state();
  const goal = 500;

  const animations = [];
  function playAllAnimations() {
    if (!animations.length) {
      animations.push(
        animate(
          icon,
          { rotate: 360 },
          { duration: 0.6, type: "spring", bounce: 0.5 }
        )
      );
      animations.push(
        animate(
          moneyContainer,
          { y: [20, 0], opacity: [0, 1] },
          { duration: 0.6, type: "spring", bounce: 0.5 }
        )
      );
    } else {
      animate(
        progress,
        { width: `${(money / goal) * 100}%` },
        { duration: 0.6, type: "spring", bounce: 0.5 }
      );
      animations.forEach((animation) => {
        animation.pause();
        animation.time = 0;
        animation.play();
      });
    }
    if (money >= goal) {
      triggerConfetti();
    }
  }

  function triggerConfetti() {
    confetti({
      particleCount: 200,
      spread: 70,
      origin: { y: 0.6 }, // Adjust origin for better effect
      colors: ["#f00", "#0f0", "#00f", "#ff0", "#f0f"], // Example colors
    });
  }

  function increment() {
    if (money < goal) {
      money += 50;
      playAllAnimations();
    }
  }

  function decrement() {
    if (money > 0) {
      money -= 50;
      playAllAnimations();
    }
  }
</script>

<div class="flex h-svh w-svw items-center justify-center p-5">
  <div class="relative">
    <div
      class="absolute -top-4 left-32 z-10 -translate-x-1/2 rounded-full bg-yellow-300 px-3 py-1 text-sm font-bold text-blue-950 shadow-md"
    >
      Tip Goal
    </div>

    <div
      class="relative flex w-fit items-center gap-4 rounded-full bg-blue-950 px-6 py-4 text-white"
    >
      <div
        bind:this={icon}
        class="shrink rounded-full p-2 outline-2 outline-yellow-300"
      >
        <Icon
          icon="fluent-emoji-high-contrast:money-bag"
          class="money-icon text-4xl text-yellow-300"
        />
      </div>
      <div>
        <div class="mb-2 text-xl font-bold">
          <span bind:this={moneyContainer} class="money-amount inline-block"
            >€{money}</span
          >
          / €{goal}
        </div>
        <div class="relative h-4 w-60 overflow-hidden rounded-full">
          <div class="absolute h-full w-full bg-blue-600/20"></div>
          <div
            bind:this={progress}
            class="progress-bar absolute h-full rounded-full bg-yellow-300"
            style="width:{(money / goal) * 100}%"
          ></div>
        </div>
      </div>
    </div>

    <div class="mt-4 flex justify-center gap-2">
      <button
        on:click={increment}
        class="rounded bg-amber-500 px-4 py-2 text-white">Increment</button
      >
      <button
        on:click={decrement}
        class="rounded bg-red-500 px-4 py-2 text-white">Decrement</button
      >
    </div>
  </div>
</div>
