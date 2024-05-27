<script>
    import { spring } from "svelte/motion";
    import AuroraBackground from "$lib/components/Utils/+AuroraBackground.svelte";
  
    let opacity = spring(0);
    let y = spring(40);
  </script>
  
  <AuroraBackground>
    <main
      style="opacity: {$opacity}; transform: translate3d(0, {$y}px, 0);"
      class="relative flex flex-col gap-4 items-center justify-center px-4"
      on:mouseenter="{() => {
        opacity.set(1);
        y.set(0);
      }}"
      on:mouseleave="{() => {
        opacity.set(0);
        y.set(40);
      }}"
    >
      <div class="text-3xl md:text-7xl font-bold dark:text-white text-center">
        Background lights are cool you know.
      </div>
      <div class="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
        And this, is chemical burn.
      </div>
      <button class="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2">
        Debug now
      </button>
    </main>
  </AuroraBackground>