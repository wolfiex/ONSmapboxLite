<script>
  import ONSHeaderLogoLarge from "./ons/svg/ONSHeaderLogoLarge.svelte";
  import ONSHeaderLogoSmall from "./ons/svg/ONSHeaderLogoSmall.svelte";
  import ONSPhaseBanner from "./ons/ONSPhaseBanner.svelte";

  export let mobileMap = true;
  export let withoutBackground = false;

  $: innerWidth = 0;
  let hasMap =
    ($$slots.map && mobileMap) || ($$slots.map && !mobileMap && withoutBackground) ? "ons-page--has-map" : "";
</script>

<svelte:window bind:innerWidth />

<div class="ons-page {hasMap}">
  <div class="ons-page__content">
    <a class="ons-skip-link" href="#main-content">Skip to main content</a>
    <ONSPhaseBanner phase="ALPHA" />
    <header class="ons-header ons-header--hero" role="banner">
      <div class="ons-header__top">
        <div class="ons-container">
          <div
            class="ons-header__grid-top ons-grid ons-grid--gutterless ons-grid--flex ons-grid--between ons-grid--vertical-center ons-grid--no-wrap "
          >
            <div class="ons-grid__col ons-col-auto">
              <div class="ons-header__logo--large">
                <a class="ons-header__logo-link" href="#0">
                  <ONSHeaderLogoLarge />
                </a>
              </div>
              <div class="ons-header__logo--small">
                <a class="ons-header__logo-link" href="#0">
                  <ONSHeaderLogoSmall />
                </a>
              </div>
            </div>
            <div class="ons-header__links grid__col col-auto">
              <div class="ons-grid__col ons-col-auto">
                <ul class="ons-language-links">
                  <li class="ons-language-links__item">
                    <a href="#0" lang="cy">Cymraeg</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    <div class="wrapper">
      <!-- // XXX This .header should really be part of <header/> semantically speaking; might need to move it back in there, and reset max-width on the -->
      <div class="header">
        <slot name="header" />
      </div>
      {#if (mobileMap && $$slots.map) || (!mobileMap && innerWidth >= 500)}
        <div class="map">
          <slot name="map" />
        </div>
      {/if}
      <div class="body">
        <slot name="body">
          <div class="ons-page__container ons-container ">
            <main id="main-content" class="ons-page__main ">
              <slot />
            </main>
          </div>
        </slot>
      </div>
    </div>
  </div>
  <slot name="footer">
    <footer class="ons-footer">
      <div class="ons-footer__body ons-page__footer" data-analytics="footer">
        <div class="ons-container" />
      </div>
    </footer>
  </slot>
</div>

<style lang="scss">
  @import "./../../node_modules/@ons/design-system/scss/vars/_index.scss";
  .ons-page .ons-container {
    max-width: 100%;
  }
  .ons-page__main {
    margin: 0;
  }

  .wrapper {
    /* background: $color-grey-15; */
    display: flex;
    flex-flow: column;
    position: relative;
  }

  .body {
    background: whitesmoke;
  }

  .ons-footer {
    background: transparent;
  }
  .ons-footer__body {
    background: transparent;
    margin: 0 20px;
    padding: 0;
  }

</style>
