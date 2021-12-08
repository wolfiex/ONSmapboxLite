<script>
  import ONSError from "./partials/ONSError.svelte";
  export let id, type, textFieldValue, onInput, onChange, renderError;
  export let hint = "";
  export let labelText = "";
  export let accessiblePlaceholder = false;
  export let errorText = "Custom error message";
  function typeAction(node) {
    node.type = type;
  }
</script>

<ONSError {errorText} {id} {renderError}>
  <div class="ons-field">
    <label
      class="ons-label {accessiblePlaceholder ? 'ons-label--placeholder' : ''} {hint
        ? 'ons-label--with-description'
        : ''}"
      for={id}>{labelText}</label
    >
    {#if hint}
      <span id="description-hint" class="ons-label__description  ons-input--with-description">
        {hint}
      </span>
    {/if}
    <input
      {id}
      class="ons-input ons-input--text ons-input-type__input {accessiblePlaceholder
        ? 'ons-input--placeholder'
        : ''} {renderError ? 'ons-input--error' : ''}"
      aria-describedby={hint ? "description-hint" : ""}
      placeholder={accessiblePlaceholder ? labelText : ""}
      bind:value={textFieldValue}
      on:input={() => onInput(textFieldValue)}
      on:change={() => onChange(textFieldValue)}
      use:typeAction
    />
  </div>
</ONSError>
