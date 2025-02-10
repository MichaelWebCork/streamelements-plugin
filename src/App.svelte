<script lang="ts">
  import Icon from "@iconify/svelte";
  import anime from "animejs";
  import confetti from "canvas-confetti"; // Import confetti library

  let money = $state(100);
  const goal = 500;
  let animations: anime.AnimeInstance[] = [];

  function setupAnimations() {
    animations.push(
      anime({
        targets: ".money-icon",
        rotate: "1turn",
        easing: "spring(1, 80, 8, 15)",
        duration: 100,
        autoplay: false,
      })
    );
    animations.push(
      anime({
        targets: ".money-amount",
        translateY: [10, 0],
        opacity: [0, 1],
        easing: "spring(1, 80, 8, 15)",
        duration: 100,
        autoplay: false,
      })
    );
  }

  function playAllAnimations() {
    if (!animations.length) {
      setupAnimations();
    }
    if (money >= goal) {
      triggerConfetti();
    }
    anime({
      targets: ".progress-bar",
      width: `${(money / goal) * 100}%`,
      easing: "spring(1, 80, 8, 15)",
      duration: 100,
      autoplay: true,
    });

    animations.forEach((animation) => {
      animation.reset();
      animation.play();
    });
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
      <div class="shrink rounded-full p-2 outline-2 outline-yellow-300">
        <Icon
          icon="fluent-emoji-high-contrast:money-bag"
          class="money-icon text-4xl text-yellow-300"
        />
      </div>
      <div>
        <div class="mb-2 text-xl font-bold">
          <span class="money-amount inline-block">€{money}</span> / €{goal}
        </div>
        <div class="relative h-4 w-60 overflow-hidden rounded-full">
          <div class="absolute h-full w-full bg-blue-600/20"></div>
          <div
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
