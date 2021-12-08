<script>
  export let labelText, id, hint, autosuggestValue, autosuggestData, header;
  let n;
  let inverted = header ? "input--with-white-description" : "";
  let inputContainer = header ? "header-input-container" : "non-header-input-container";

  function onClick({ target }) {
    autosuggestValue = target.innerText;
  }

  function onKeyUp(e) {
    if (e.keyCode === 13) {
      autosuggestValue = document.querySelector(".ons-autosuggest-input__option--focused").innerText;
    }
  }
</script>

<div class="ons-grid ons-grid--gutterless">
  <div class="ons-grid__col ons-col-8@m {inputContainer}">
    <div
      id="{id}-container"
      class="ons-js-autosuggest   ons-autosuggest-input"
      data-instructions="Use up and down keys to navigate suggestions once you&#39;ve typed more than two characters. Use the enter key to select a suggestion. Touch device users, explore by touch or with swipe gestures."
      data-aria-you-have-selected="You have selected"
      data-aria-min-chars="Enter 3 or more characters for suggestions."
      data-aria-one-result="There is one suggestion available."
      data-aria-n-results="There are {n} suggestions available."
      data-aria-limited-results="Results have been limited to 10 suggestions. Type more characters to improve your search"
      data-more-results="Continue entering to improve suggestions"
      data-results-title="Suggestions"
      data-no-results="No suggestions found. You can enter your own answer"
      data-type-more="Continue entering to get suggestions"
      data-autosuggest-data={autosuggestData}
    >
      <div class="ons-field">
        {#if labelText}
          <label class="ons-label  {hint ? 'ons-label--with-description' : ''}" for={id} id="{id}-label"
            >{labelText}
          </label>
        {/if}
        {#if hint}
          <span id="{id}-label-description-hint" class="ons-label__description  ons-input--with-description {inverted}">
            {hint}
          </span>
        {/if}
        <input
          type="text"
          {id}
          bind:value={autosuggestValue}
          on:keyup={onKeyUp}
          class="ons-input ons-input--text ons-input-type__input ons-js-autosuggest-input "
          autocomplete="off"
          aria-describedby={hint ? `${id}-label-description-hint` : ""}
        />
      </div>
      <div class="ons-autosuggest-input__results ons-js-autosuggest-results">
        <header id="{id}-suggestions" class="ons-autosuggest-input__results-title ons-u-fs-s">Suggestions</header>
        <ul
          on:click={onClick}
          class="ons-autosuggest-input__listbox ons-js-autosuggest-listbox"
          role="listbox"
          id="{id}-listbox"
          aria-labelledby="{id}-suggestions"
          tabindex="-1"
        />
      </div>
      <div
        class="ons-autosuggest-input__instructions ons-u-vh ons-js-autosuggest-instructions"
        id="{id}-instructions"
        tabindex="-1"
      >
        Use up and down keys to navigate suggestions once you&#39;ve typed more than two characters. Use the enter key
        to select a suggestion. Touch device users, explore by touch or with swipe gestures.
      </div>
      <div
        class="ons-autosuggest-input__status ons-u-vh ons-js-autosuggest-aria-status"
        aria-live="assertive"
        role="status"
        tabindex="-1"
      />
    </div>
  </div>
</div>

<style lang="scss">
  @import "../../../node_modules/@ons/design-system/scss/vars/_index.scss";

  .input--with-white-description {
    color: $color-white;
  }

  @media only screen and (min-width: map-get($grid-bp, s)) {
    .ons-input--select:not(.ons-input--block):not(.ons-input-search):not([class*="input--w-"]),
    .ons-input--text:not(.ons-input--block):not(.ons-input-search):not([class*="input--w-"]) {
      width: 100%;
    }
  }

  @media only screen and (min-width: map-get($grid-bp, m)) {
    .ons-col-8\@m {
      max-width: 100%;
    }
  }

  .header-input-container {
    width: 100%;
  }

  .non-header-input-container {
    width: 90%;
  }
</style>
