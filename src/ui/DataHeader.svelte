<script>
  import slugify from "slugify";
  export let tableName, location, topicPage;
</script>

<header class="ons-header ons-header--hero" role="banner">
  <div class="ons-header__main ons-header__main--with-description">
    <div class="ons-container">
      <div class="ons-grid--flex ons-grid--between ons-grid--vertical-center">
        {#if tableName || topicPage}
          <div class="ons-header__title header__title--with-description data-header-1__title">
            <h2>
              {tableName
                ? tableName.charAt(0).toUpperCase() + tableName.slice(1).toLowerCase()
                : topicPage
                ? `Explore ${topicPage.toLowerCase()}`
                : ""}
            </h2>
          </div>
          <a href="/categories">Change</a>
        {:else}
          <div class="ons-header__title" id="header-data-2__title">
            <h2 id="census-atlas-header-2__title"><a href="/categories">Choose a data option</a></h2>
          </div>
        {/if}
      </div>
      <hr />
      {#if topicPage}
        <div class="ons-header__title" id="header-data-2__title">
          <h2 id="census-atlas-header-2__title">
            <a href="/categories/{slugify(topicPage).toLowerCase()}"
              >Choose an option within {topicPage.toLowerCase()}</a
            >
          </h2>
        </div>
      {:else if location}
        <div class="ons-grid--flex ons-grid--between">
          <h2 class="ons-header__title" id="header-data-2__location">In {location}</h2>
          <a href="0#">Change</a>
        </div>
      {:else}
        <div class="ons-grid--flex ons-grid--between ons-grid--vertical-center">
          <h3 class="ons-header__desc">In England & Wales</h3>
          <a href="0#">Change</a>
        </div>
      {/if}
    </div>
  </div>
</header>

<style lang="scss">
  @import "./../../node_modules/@ons/design-system/scss/vars/_index.scss";

  a {
    color: $color-white;
  }
  a:hover {
    color: $color-white;
    text-decoration: underline solid $color-white 2px;
  }
  a:focus {
    background-color: $color-sun-yellow;
    -webkit-box-shadow: 0 -2px $color-sun-yellow, 0 4px $color-black;
    box-shadow: 0 -2px $color-sun-yellow, 0 4px $color-black;
    color: $color-black;
    outline: 3px solid transparent;
    text-decoration: none;
  }

  hr {
    border: 0.5px solid $color-grey-35;
    margin: 0.5rem 0;
  }

  h2,
  h3 {
    margin: 0;
  }

  .data-header-1__title {
    margin: 0;
  }
  #header-data-2__location {
    font-size: 1.33333rem;
  }

  @media only screen and (max-width: map-get($grid-bp, m)) {
    #header-data-2__location {
      font-size: 1.11111rem;
    }
  }
  #header-data-2__title {
    margin: 0.3rem 0;
  }
  #census-atlas-header-2__title {
    font-size: 1.11111rem;
    font-weight: 200;
  }
</style>
