<script>
  import ONSHeaderLogoLarge from "./svg/ONSHeaderLogoLarge.svelte";
  import ONSHeaderLogoSmall from "./svg/ONSHeaderLogoSmall.svelte";
  export let serviceTitle = "";
  export let description = "";
</script>

<div class="ons-header__main ons-header__main--with-description">
  <div class="ons-container">
    <div
      class="ons-grid ons-grid--gutterless ons-grid--flex ons-grid--between ons-grid--vertical-center ons-grid--no-wrap"
    >
      <div class="ons-grid__col ons-col-auto ons-u-flex-shrink">
        <a class="ons-header__title-link" href="#0">
          <div class="ons-header__title header__title--with-description">{serviceTitle}</div>
        </a>
      </div>
    </div>
    <p class="ons-header__desc">{description}</p>
  </div>
</div>
