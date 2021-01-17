<script>
  import { onMount } from "svelte";
  import { select } from "./helpers";
  import Welcome from "./screens/Welcome.svelte";

  let celebsPromise;
  let selection;

  let state = "welcome";

  const start = async (e) => {
    const { celebs, lookup } = celebsPromise;
    console.log(e.detail);
    selection = select(celebs, lookup, e.detail.category.slug);
    state = "playing";
  };

  const loadCelebs = async () => {
    const res = await fetch("https://cameo-explorer.netlify.app/celebs.json");
    const data = await res.json();
    const lookup = new Map();

    data.forEach((c) => {
      lookup.set(c.id, c);
    });

    const subset = new Set();

    data.forEach((c) => {
      if (c.reviews >= 50) {
        subset.add(c);
        c.similar.forEach((id) => {
          subset.add(lookup.get(id));
        });
      }
    });

    return {
      celebs: Array.from(subset),
      lookup,
    };
  };

  onMount(async () => {
    celebsPromise = await loadCelebs();
  });
</script>

<main>
  {#if state === "welcome"}
    <Welcome on:select={start} />
  {:else if state === "playing"}
    <div>Y</div>
  {/if}
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
</style>
