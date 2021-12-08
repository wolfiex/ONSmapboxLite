<script>
  import { getContext } from "svelte";
  export let shareText;
  export let facebook = false;
  export let twitter = false;
  export let linkedin = false;
  export let email = false;
  let pageURL = getContext("pageURL");
  let pageTitle = getContext("pageTitle");
  let href = facebook
    ? `https://www.facebook.com/sharer/sharer.php?u=${pageURL}`
    : twitter
    ? `https://twitter.com/intent/tweet?original_referer&amp;text=A page to share&amp;url=${pageURL}`
    : linkedin
    ? `https://www.linkedin.com/sharing/share-offsite/?url=${pageURL}`
    : email
    ? `mailto:?subject=${pageTitle}&body=${pageURL}`
    : "";
  let multiRow = getContext("multiRow");
  let equalWidthCol = multiRow ? "ons-list__item--inline-equal-width-columns" : "";
</script>

<li class="ons-list__item {equalWidthCol} ">
  <span class="ons-list__prefix" aria-hidden="true">
    <slot />
  </span><a {href} class="ons-list__link  " target="_blank" rel="noreferrer external"
    >{shareText}<span class="ons-u-vh">this link will open in a new tab</span></a
  >
</li>

<style>
  .ons-list__item--inline-equal-width-columns {
    display: inline-block;
    min-width: 50%;
  }
</style>
