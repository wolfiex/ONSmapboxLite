<script>
  import { getContext } from "svelte";
  export let id, value, labelText, onChange;
  let name = getContext("name");
  export let bindGroup = [];

  function onChangeBindGroup({ target }) {
    const { value, checked } = target;
    if (checked) {
      bindGroup = [...bindGroup, value];
    } else {
      bindGroup = bindGroup.filter((item) => item !== value);
    }
  }
</script>

<span class="ons-checkboxes__item">
  <span class="ons-checkbox ">
    <input
      type="checkbox"
      {id}
      class="ons-checkbox__input ons-js-checkbox "
      {value}
      {name}
      checked={bindGroup.includes(value)}
      on:change={(e) => {
        onChangeBindGroup(e);
        onChange(bindGroup);
      }}
    />
    <label class="ons-checkbox__label  " for={id} id="{id}-label">{labelText} </label>
  </span>
</span>
<br />
