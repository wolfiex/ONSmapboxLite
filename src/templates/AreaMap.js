
// imports
import mapboxgl from 'mapbox-gl';
import { onMount } from 'svelte';


let webgl_canvas;
export let mapobject = null;
let minzoom = 4;
let maxzoom = 14;



//Main map style
export let mapstyle = "https://bothness.github.io/ons-basemaps/data/style-omt.json"


/// list all sources here [name]:values
export let mapsource = {    

    "oa": {
        type: "vector",
        tiles: ["https://cdn.ons.gov.uk/maptiles/t9/{z}/{x}/{y}.pbf"],
        promoteId: { OA_bound_ethnicity: "oa11cd" }
      },
    //   { // example data source
    //     type: 'geojson',
    //     data: data,
    //     promoteId: { layer_name: 'code'}
    //   }
    
};



// list all layers extracted from the sources. [order]:values
export let maplayer = {
    'boundary_country':
        {
            id: "oa_boundary",
            type:  "line",
            source:  "oa",
            "source-layer":  "OA_bound_ethnicity",
            paint: {
              //'feature-state','selected'], true], 'rgba(0, 0, 0, 0.2)',
              "line-color": "steelblue"
              // ],
            }
        }

}



export let location = {
    bounds: [[-5.816, 49.864], [1.863, 55.872]], // England & Wales bounding box
};
let maxbounds = [[-9, 47], [5, 57]];




/// MAP creation
async function init() {

    console.warn(webgl_canvas)

    mapobject = new mapboxgl.Map({
    container: "mapcontainer",
    style: mapstyle,
    minZoom: minzoom,
    maxZoom: maxzoom,
    maxBounds: maxbounds,
    pitch: 15,
    center: [0, 52],
    zoom: 4,
  });

    mapobject.addControl(new mapboxgl.NavigationControl(),'bottom-right');

    // correct error - ignore 403 missing tiles
    mapobject.on('error',e => {if (e.error.status != 403) console.error(e.error.status,e.error.message)});


    // const link = document.createElement('link');
    // link.rel = 'stylesheet';
    // link.href = 'https://unpkg.com/mapbox-gl/dist/mapbox-gl.css';
    // document.head.appendChild(link);
    // link.onload = SetLayers;

    mapobject.on("load", SetLayers)

}














 /// A function to define map parameters.  
function SetLayers () {

    // set the sources
    for (const [ key, value ] of Object.entries(mapsource)) {
        if (mapobject.getSource(key))  mapobject.removeSource(key)
        mapobject.addSource(key, value);
    }
    
    // set the layers
    for (const [ key, value ] of Object.entries(maplayer)) {
        if (mapobject.getLayer(value.id))  mapobject.removeLayer(value.id);
        mapobject.addLayer(value,key);
    }

    // move map to location
    mapobject.fitBounds( location.bounds, { padding: 20 } );

//    console.warn(map.querySourceFeatures("oa", { sourceLayer: vector.layer }));


}





onMount(init)