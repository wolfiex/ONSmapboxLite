<script>
  import ONSError from "./partials/ONSError.svelte";
  import { setContext } from "svelte";

  export let errorText = "Select [whatever it is]";
  export let name, renderError;

  setContext("name", name);
</script>

<ONSError {errorText} id={name} {renderError}>
  <div class="ons-input-items">
    <div class="ons-radios__items">
      <slot />
    </div>
  </div>
</ONSError>
