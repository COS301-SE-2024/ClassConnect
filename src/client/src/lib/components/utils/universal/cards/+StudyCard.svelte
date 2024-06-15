<script lang="ts">
    export let title;
    export let description;
    import cover from '$lib/images/pdf-cover.svg';
</script>

<div class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70">
    <img class="w-full h-20 rounded-t-xl" src={cover} alt="PDF preview">
    <div class="p-4 md:p-5">
      <h3 class="text-lg font-bold text-gray-800 dark:text-white">
        {title}
      </h3>
      <p class="mt-1 text-gray-500 dark:text-neutral-400">
        {description}
      </p>
      <a class="mt-2 py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:pointer-events-none" href="/student/module/study/material">
        Open PDF
      </a>
    </div>
</div>