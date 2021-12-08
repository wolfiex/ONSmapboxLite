<script>
  import ONSCollapsible from "./ons/ONSCollapsible.svelte";
  import { indexPageSuggestions } from "../config.js";
  export let url;
  export let suggestions = indexPageSuggestions;
</script>

<div class="component-margin--2">
  <h2>Explore by topic</h2>
  <p>The 2021 Census tells us a lot about how people in England and Wales live and work.</p>
  <p><a href={url}>Choose a data option</a></p>
  <ONSCollapsible title="Show me suggestions">
    {#each suggestions as suggestion}
      <p><a href={suggestion.url}>{suggestion.text}</a></p>
    {/each}
  </ONSCollapsible>
</div>

<style>
  .component-margin--2 {
    margin-bottom: 2rem;
  }
</style>
