<script>
  import { setContext } from "svelte";
  export let title = "Share this post";
  export let pageURL, pageTitle;
  export let multiRow = false;
  setContext("multiRow", multiRow);
  setContext("pageURL", pageURL);
  setContext("pageTitle", pageTitle);
</script>

<h2 class="ons-u-fs-r--b ons-u-mb-xs">{title}</h2>
<ul class="ons-list ons-list--inline ons-list--bare ons-list--icons">
  <slot />
</ul>
