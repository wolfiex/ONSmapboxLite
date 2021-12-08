<script>
  import { getContext, setContext } from "svelte";

  export let id;
  export let type;
  export let url = null;
  export let props = {};
  export let data = null;
  export let layer = null;
  export let promoteId = null;
  export let minzoom = getContext("minzoom");
  export let maxzoom = getContext("maxzoom");

  let loaded = false;
  $: loaded, console.log("boundary set loaded");

  const { getMap } = getContext("map");
  const map = getMap();

  setContext("source", id);
  setContext("source-layer", layer);

  setContext("tileset-minzoom", minzoom);
  setContext("tileset-maxzoom", maxzoom);

  // clears out self on map object
  if (map.getSource(id)) {
    map.removeSource(id);
  }

  // watches for isSourceLoaded method on map
  function isSourceLoaded() {
    if (map.isSourceLoaded(id)) {
      loaded = true;
    } else {
      setTimeout(() => {
        isSourceLoaded();
      }, 100);
    }
  }

  // watches for isMapLoaded then runs the addSource method
  function isMapLoaded() {
    if (map.isStyleLoaded(id)) {
      addSource();
    } else {
      setTimeout(() => {
        isMapLoaded();
      }, 100);
    }
  }

  // Set optional source properties
  if (minzoom) {
    props.minzoom = minzoom;
  }
  if (maxzoom) {
    props.maxzoom = maxzoom;
  }
  if (layer && promoteId) {
    props.promoteId = {};
    props.promoteId[layer] = promoteId;
  } else if (promoteId) {
    props.promoteId = promoteId;
  }

  // runs the addSource method
  function addSource() {
    if (type == "geojson") {
      if (data) {
        map.addSource(id, {
          type: type,
          data: data,
          ...props,
        });
        isSourceLoaded();
      } else if (url) {
        map.addSource(id, {
          type: type,
          data: url,
          ...props,
        });
        isSourceLoaded();
      }
    } else if (type == "vector") {
      map.addSource(id, {
        type: type,
        tiles: [url],
        ...props,
      });
      isSourceLoaded();
    }
  }

  // kicks off the chain
  isMapLoaded();
</script>

{#if loaded}
  <slot />
{/if}
