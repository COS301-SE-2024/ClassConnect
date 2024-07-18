<script lang="ts">
  import { Pagination } from 'flowbite-svelte';

  let pages = [{ name: "1"}, { name: "2" }, { name: "3" }, { name: "4" }, { name: "5" }];
  const previous = () => {
    alert('Previous btn clicked. Make a call to your server to fetch data.');
  };
  const next = () => {
    alert('Next btn clicked. Make a call to your server to fetch data.');
  };
  const handleClick = () => {
    alert('Page clicked');
  };
</script>

<Pagination {pages} on:previous={previous} on:next={next} on:click={handleClick} />