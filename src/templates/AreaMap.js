
// imports
import mapboxgl from 'mapbox-gl';
import { onMount } from 'svelte';
import { writable, get } from 'svelte/store';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import * as MapboxDrawGeodesic from 'mapbox-gl-draw-geodesic';
import DrawRectangle from 'mapbox-gl-draw-rectangle-mode';


import 'mapbox-gl/dist/mapbox-gl-draw.css'
import 'mapbox-gl/dist/mapbox-gl.css'

let webgl_canvas;
export let mapobject = null;
let minzoom = 4;
let maxzoom = 14;


export const customselector = true
export const draw_type = writable(undefined);
export const datalayers = writable(['centroids']);



//Main mapobject style
export let mapstyle = "https://bothness.github.io/ons-basemaps/data/style-omt.json"


/// list all sources here [name]:values
export let mapsource = {    

    "oa": {
        type: "vector",
        tiles: ["https://cdn.ons.gov.uk/maptiles/t9/{z}/{x}/{y}.pbf"],
        // promoteId: { OA_bound_ethnicity: "oa11cd" }
      },

    "oa11s":
    {type:"vector",
        tiles:["https://wolfiex.github.io/ONStileBuilder/tiles/tileserver/{z}/{x}/{y}.pbf"],
    //   layer: "OA11",
    //   id: "oa11cd"
    }


    //   { // example data source
    //     type: 'geojson',
    //     data: data,
    //     promoteId: { layer_name: 'code'}
    //   }
    
};



// list all layers extracted from the sources. [order]:values
export let maplayer = [
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
        },
    
        {
            id: "oa11_boundaries",
            type:  "line",
            source:  "oa11s",
            "source-layer":  "areas",
            paint: {
              //'feature-state','selected'], true], 'rgba(0, 0, 0, 0.2)',
              "line-color": "red"
              // ],
            }
        },
        {
            id: "oa11_centroids",
            type:  "circle",
            source:  "oa11s",
            "source-layer":  "centroids01",
            paint: {
              'circle-radius':4.01,  
              'circle-color':'green'
            }
        }
]





export let location = {
    bounds: [[-5.816, 49.864], [1.863, 55.872]], // England & Wales bounding box
};
let maxbounds = null;[[-9, 47], [5, 57]];
var draw 



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
    mapobject.addControl( new mapboxgl.ScaleControl({ position: "bottom-left" }));
    mapobject.addControl(new mapboxgl.NavigationControl(),'bottom-right');

    // correct error - ignore 403 missing tiles
    mapobject.on('error',e => {if (e.error.status != 403) console.error(e.error.status,e.error.message)});


    

    // drawing tool 
        init_draw()
        draw_type.set('draw_polygon')
        // draw_type.set(undefined)
 

    
    mapobject.on("load", SetLayers)

}














 /// A function to define mapobject parameters.  
function SetLayers () {
    
    // set the sources
    for (const [ key, value ] of Object.entries(mapsource)) {
        if (mapobject.getSource(key))  mapobject.removeSource(key)
        mapobject.addSource(key, value);
    }
    
    // set the layers
    for (const value of maplayer) {
        if (mapobject.getLayer(value.id))  mapobject.removeLayer(value.id);
        mapobject.addLayer(value);
    }

    // move mapobject to location
    mapobject.fitBounds( location.bounds, { padding: 20 } );


console.warn('src',mapobject.getSource("oa"),mapobject.getSource("oa11s"))
console.warn('layer',mapobject.getLayer("oa_boundary"),mapobject.getLayer("oa11_boundaries"))

}


////// GEODRAW

async function init_draw() {

    let modes = MapboxDrawGeodesic.enable(MapboxDraw.modes);

    draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {        
        trash: false,
        },

        // defaultMode: 'draw_polygon',
        modes: Object.assign(MapboxDraw.modes,{
            draw_circle:modes.draw_circle, draw_polygon:modes.draw_polygon,
            draw_rectangle:DrawRectangle, 
} ), });
// mapobject.addControl(draw, 'top-left')


mapobject.on('draw.modechange', (event) => {
    console.log('modechange', event.mode);
  });

    mapobject.on('draw.create', change);
    mapobject.on('draw.update', change );
    mapobject.on('draw.move', change );



    draw_type.subscribe(update_draw)
    function update_draw(newtype){
        if (newtype === undefined){
            try{mapobject.removeControl(draw, 'top-left');}catch(e){}
        } else {
            try{mapobject.removeControl(draw, 'top-left');}catch(e){}
            mapobject.addControl(draw, 'top-left');
            draw.changeMode(newtype);
        }
    
}

/// create or update
function change (event) {
    const geojson = event.features[0];
    console.log('update', event.action, geojson);

    if (MapboxDrawGeodesic.isCircle(geojson)) {
      const center = MapboxDrawGeodesic.getCircleCenter(geojson);
      const radius = MapboxDrawGeodesic.getCircleRadius(geojson);
      console.log('circle', 'center', center, 'radius', radius);
    }

    var lat = geojson.geometry.coordinates[0].map(p=> p[1]);
    var lng = geojson.geometry.coordinates[0].map(p=>p[0]);
    
    //n  push current map bounds to stop shrink zooming. 
    Object.values(mapobject.getBounds()).forEach(p=>{lat.push(p.lat); lng.push(p.lng); console.log(p)})
      


    var min_coords = [
        Math.min.apply(null, lng),
        Math.min.apply(null, lat)
      ]
    var max_coords = [
        Math.max.apply(null, lng),
        Math.max.apply(null, lat)
    ]
   
    const bbox = [min_coords, max_coords]

      
      
      

      mapobject.fitBounds( bbox, { padding: 20 } );

      // const bbox = geojson.geometry.coordinates[0]//.map(d=>mapobject.project(d))//
      

    console.error('bbox',bbox,lat,lng)
    //   // Find features intersecting the bounding 

    const selectedFeatures = mapobject.queryRenderedFeatures(bbox.map(d=>mapobject.project(d)), {
        layers: get(datalayers)
      });

      console.warn(selectedFeatures);
    //   // console.error();
      const fips = selectedFeatures.map((feature) => feature.properties.lsoa01nm);
    //   // Set a filter matching selected features by FIPS codes
    //   // to activate the 'counties-highlighted' layer.
    //   // map.setFilter("oa_boundary", ["in", "oa11cd", ...fips]);

      console.warn(fips);
    //   console.warn(map);
    //   map.setPaintProperty("oa_boundary", "fill-color", [
    //     "match",
    //     ["get", "oa11cd"],
    //     ["literal", ...fips],
    //     "orange",
    //     "green"
    //   ]);
    //   // console.warn(map.setPaint("oa_boundary"), { "line-color": "blue" });



    

  }

  mapobject.on('zoom',()=> console.log('zoomend',mapobject.getZoom()))
  



}











/// main    
onMount(init)