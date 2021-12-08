<script>
  import { setContext } from "svelte";
  import ONSError from "./partials/ONSError.svelte";
  export let checkboxesLabel, title, id, name, renderError;
  setContext("name", name);
  export let legendIsQuestionTitle = false;
  export let errorText = "Select [whatever it is]";
</script>

<ONSError {errorText} id={name} {renderError}>
  <div class="ons-question ons-u-mt-no">
    <fieldset {id} class="ons-fieldset">
      {#if legendIsQuestionTitle}
        <legend class="ons-fieldset__legend">
          <h1 id="{id}-legend-title" class="ons-fieldset__legend-title ">{title}</h1>
        </legend>
      {/if}
      <div class="ons-input-items">
        <p class="ons-checkboxes__label">{checkboxesLabel}</p>
        <div class="ons-checkboxes__items">
          <slot />
        </div>
      </div>
    </fieldset>
  </div>
</ONSError>
