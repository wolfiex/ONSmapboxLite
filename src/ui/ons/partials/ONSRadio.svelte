<script>
  import { getContext } from "svelte";

  export let id, value, radioValue, onChange;
  let name = getContext("name");
</script>

<span class="ons-radios__item">
  <span class="ons-radio">
    <input
      type="radio"
      {id}
      class="ons-radio__input ons-js-radio"
      {value}
      bind:group={radioValue}
      {name}
      on:change={() => {
        onChange(radioValue);
      }}
    />
    <label class="ons-radio__label" for={id} id="{id}-label">
      <slot />
    </label>
  </span>
</span>
<br />
