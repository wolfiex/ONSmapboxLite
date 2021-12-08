<script>
  import ONSError from "./partials/ONSError.svelte";
  export let label, id, name, renderError, selectValue, onClick;
  export let errorText = "Select [whatever topic the drop-down is asking for]";
  export let options = [];
</script>

<ONSError {errorText} {id} {renderError}>
  <div class="ons-field">
    <label class="ons-label " for={id}>{label}</label>
    <select
      on:click={() => {
        onClick(selectValue);
      }}
      bind:value={selectValue}
      {id}
      {name}
      class="ons-input ons-input--select"
    >
      {#each options as option}
        <option value={option.value} selected={option.selected} disabled={option.disabled}>{option.label}</option>
      {/each}
    </select>
  </div>
</ONSError>
