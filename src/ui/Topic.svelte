<script>
  export let cardTitle = "";
  export let id = "card";
  export let topicList = [];
</script>

<div class="ons-card component-margin--2" aria-labelledBy="{id}-title" aria-describedBy="text">
  <h2 class="ons-u-fs-m" id="{id}-title">{cardTitle}</h2>
  <p id="{id}-text">
    <slot />
  </p>
  {#if topicList}
    <ul class="ons-list ons-list--bare">
      {#each topicList as topic}
        <li class="ons-list__item">
          <a href={topic.url} class="ons-list__link">{topic.text}</a>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .component-margin--2 {
    margin-bottom: 2rem;
    margin-top: 2rem;
  }
</style>
