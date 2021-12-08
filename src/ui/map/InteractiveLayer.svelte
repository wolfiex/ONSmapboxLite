<script>
  import { getContext } from "svelte";
  import { createEventDispatcher } from "svelte";
  import config from "./../../config";

  const dispatch = createEventDispatcher();
  export let id;
  export let source = getContext("source");
  export let sourceLayer = getContext("source-layer");
  export let type = "fill";
  export let filter = null;
  export let layout = {};
  export let paint = config.ux.map.paint.interactive;
  export let selected = null;
  export let hovered = null;
  export let click = true;
  export let clickCenter = false;
  export let hover = true;
  export let order = "tunnel_motorway_casing";
  export let maxzoom = getContext("tileset-maxzoom");
  export let minzoom = getContext("tileset-minzoom");
  export let onSelect = (selectedItem) => {};
  export let onHover = (hoveredItem) => {};
  let selectedPrev = null;

  function centroid(coords) {
    // not as accurate, but definitely faster!!
    var xSum = 0,
      ySum = 0,
      len = 0;

    coords[0].forEach(function (coord) {
      xSum += coord[0];
      ySum += coord[1];
      len++;
    });
    return [xSum / len, ySum / len];
  }

  const { getMap } = getContext("map");
  const map = getMap();
  let boundaryLayerId = `${id}-interactive-boundaries`;

  if (map.getLayer(id)) {
    map.removeLayer(id);
  }
  if (map.getLayer(boundaryLayerId)) {
    map.removeLayer(boundaryLayerId);
  }

  let options = {
    id: id,
    type: "fill",
    source: source,
    paint: { "fill-color": "rgba(255, 255, 255, 0)" },
    layout: layout,
  };

  let boundaryLayerOptions = {
    id: boundaryLayerId,
    type: "line",
    source: source,
    paint: paint,
    layout: layout,
  };

  if (filter) {
    options["filter"] = filter;
    boundaryLayerOptions["filter"] = filter;
  }

  if (sourceLayer) {
    options["source-layer"] = sourceLayer;
    boundaryLayerOptions["source-layer"] = sourceLayer;
  }
  if (maxzoom) {
    options["maxzoom"] = maxzoom;
    boundaryLayerOptions["maxzoom"] = maxzoom;
  }
  if (minzoom) {
    options["minzoom"] = minzoom;
    boundaryLayerOptions["minzoom"] = minzoom;
  }

  map.addLayer(options, order);
  map.addLayer(boundaryLayerOptions, order);

  $: if (click && selected !== selectedPrev) {
    if (selectedPrev) {
      map.setFeatureState({ source: source, sourceLayer: sourceLayer, id: selectedPrev }, { selected: false });
    }
    if (selected) {
      map.setFeatureState({ source: source, sourceLayer: sourceLayer, id: selected }, { selected: true });
    }
    selectedPrev = selected;
  }

  if (click) {
    map.on("click", id, (e) => {
      if (e.features.length > 0) {
        selected = e.features[0].id;
        onSelect(selected);

        if (selectedPrev) {
          map.setFeatureState(
            {
              source: source,
              sourceLayer: sourceLayer,
              id: selectedPrev,
            },
            { selected: false },
          );
        }

        map.setFeatureState({ source: source, sourceLayer: sourceLayer, id: selected }, { selected: true });

        if (clickCenter) {
          map.flyTo({
            center: centroid(e.features[0].toJSON().geometry.coordinates),
          });
        }

        selectedPrev = selected;
      } else {
        selectedPrev = selected = null;
        dispatch("select", {
          code: null,
        });
      }
    });
  }

  if (hover) {
    map.on("mousemove", id, (e) => {
      if (e.features.length > 0) {
        if (hovered) {
          map.setFeatureState(
            {
              source: source,
              sourceLayer: sourceLayer,
              id: hovered,
            },
            { hovered: false },
          );
        }
        hovered = e.features[0].id;
        onHover(e.features[0].id);

        map.setFeatureState({ source: source, sourceLayer: sourceLayer, id: hovered }, { hovered: true });

        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = "pointer";
      }
    });

    map.on("mouseleave", id, (e) => {
      if (hovered) {
        map.setFeatureState({ source: source, sourceLayer: sourceLayer, id: hovered }, { hovered: false });
      }
      hovered = null;
    });
  }
</script>
