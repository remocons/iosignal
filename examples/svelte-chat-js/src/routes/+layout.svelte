<script>
  let { children } = $props();
</script>

<svelte:head>
  <link rel="stylesheet" href="/global.css" />
</svelte:head>

{@render children()}