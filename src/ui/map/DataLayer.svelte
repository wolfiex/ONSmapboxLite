<script>
  import { getContext } from "svelte";
  import { getLegendSection } from "./../../model/utils";
  import { breaks } from "./../../model/censusdata/censusdata";
  import config from "./../../config";

  export let id;
  export let source = getContext("source");
  export let sourceLayer = getContext("source-layer");
  export let filter = null;
  export let layout = {};
  export let paint = {
    "fill-color": [
      "case",
      ["!=", ["feature-state", "color"], null],
      ["feature-state", "color"],
      "rgba(255, 255, 255, 0)",
    ],
  };
  export let data = null;
  export let order = "tunnel_motorway_casing";
  export let maxzoom = getContext("tileset-maxzoom");
  export let minzoom = getContext("tileset-minzoom");

  const { getMap } = getContext("map");
  const map = getMap();

  let selectedPrev = null;
  let highlightedPrev = null;

  console.log("rendering data layer");

  // remove map if present
  if (map.getLayer(id)) {
    map.removeLayer(id);
  }

  // map options
  let options = {
    id: id,
    type: "fill",
    source: source,
    paint: paint,
    layout: layout,
  };

  if (filter) {
    options["filter"] = filter;
  }

  if (sourceLayer) {
    options["source-layer"] = sourceLayer;
  }
  if (maxzoom) {
    options["maxzoom"] = maxzoom;
  }
  if (minzoom) {
    options["minzoom"] = minzoom;
  }

  map.addLayer(options, order);

  function updateData() {
    for (const key of Object.keys(data)) {
      let legendSection = getLegendSection(data[key].perc, breaks);
      map.setFeatureState(
        {
          source: source,
          sourceLayer: sourceLayer,
          id: key,
        },
        {
          color: config.ux.legend_colours[legendSection - 1],
        },
      );
    }
  }

  // when data updates colourise the map
  $: data && updateData();
</script>
