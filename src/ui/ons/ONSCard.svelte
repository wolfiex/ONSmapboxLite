<script>
  export let href = "/";
  export let title = "title";
  export let id = "card";
</script>

<div class="ons-card component-margin--2" {id} aria-labelledBy="{id}-title" aria-describedBy="text">
  <h3 class="ons-u-fs-m" id="{id}-title">
    <a {href}>{title}</a>
  </h3>
  <p id="{id}-card"><slot /></p>
</div>

<style>
  .component-margin--2 {
    margin-bottom: 2rem;
  }
</style>
