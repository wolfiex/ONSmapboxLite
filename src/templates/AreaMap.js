
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




import proj4 from 'proj4';
const osgb = '++proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs ';
const wgs84 = '+proj=longlat +datum=WGS84 +no_defs ';
// console.error(proj4(osgb,wgs84,[450048.598, 532898.59600000095088]))
// console.error(proj4(wgs84,osgb,proj4(osgb,wgs84,[450048.598, 532898.59600000095088])))

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
        // {
        //     id: "oa11_centroids",
        //     type:  "circle",
        //     source:  "oa11s",
        //     "source-layer":  "centroids01",
        //     paint: {
        //       'circle-radius':4.01,  
        //       'circle-color':'green'
        //     }
        // }
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
async function change (event) {
    const geojson = event.features[0];
    console.log('update', event.action, geojson);

    if (MapboxDrawGeodesic.isCircle(geojson)) {
      const center = MapboxDrawGeodesic.getCircleCenter(geojson);
      const radius = MapboxDrawGeodesic.getCircleRadius(geojson)/100;// must divide by 100 to get accurate results
      console.log('circle', 'center', center, 'radius', radius);

      // lets space points around the centre to create a polygon

      var numberOfPoints = 20;
      var theta = 2.0*Math.PI/numberOfPoints;

      geojson.geometry.coordinates[0] = []

      for ( var i = 1; i <= numberOfPoints; i++ ) {
        geojson.geometry.coordinates[0].push([( radius * Math.cos(theta * i) + center[0] ),( radius * Math.sin(theta * i) + center[1] )])
      }

    }

    const coords = geojson.geometry.coordinates[0].map(d=>proj4(wgs84, osgb,d))
    var lat = coords.map(p=> p[1]);
    var lng = coords.map(p=>p[0]);
    
    var min_coords = [
        Math.min.apply(null, lng),
        Math.min.apply(null, lat)
      ]
    var max_coords = [
        Math.max.apply(null, lng),
        Math.max.apply(null, lat)
    ]
   
    const bboxosm = [min_coords, max_coords]


    const lsoa = `https://ons-inspire.esriuk.com/arcgis/rest/services/Census_Boundaries/Lower_Super_Output_Areas_December_2011_Centroids/MapServer/0/query?f=json&returnIdsOnly=false&returnCountOnly=false&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=${[bboxosm[0].join(','),bboxosm[1].join(',')].join(',')}&where=1%3D1`

    const oa = `https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/Output_Areas_December_2011_Population_Weighted_Centroids/FeatureServer/0/query?f=json&returnIdsOnly=false&returnCountOnly=false&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=${[bboxosm[0].join(','),bboxosm[1].join(',')].join(',')}&where=1=1`

    let centroids = await fetch(oa).then(r=>r.json()).then(r=>{console.error(r);const id = Object.keys(r.features[0].attributes)[0
    ]; return r.features.map(f=>f.attributes[id])})
    
    //.then(r=>{console.error(r);const id = r.displayFieldName; return r.features.map(f=>f.attributes[id])})

    // console.warn('bbox',[bboxosm[0].join(','),bboxosm[1].join(',')].join(','),centroids)

    // point in polygon
    centroids.filter(function(point) {
      var n = coords.length,
          p = coords[n - 1],
          x = point[0], y = point[1],
          x0 = p[0], y0 = p[1],
          x1, y1,
          inside = false;
    
      for (var i = 0; i < n; ++i) {
        p = coords[i], x1 = p[0], y1 = p[1];
        if (((y1 > y) !== (y0 > y)) && (x < (x0 - x1) * (y - y1) / (y0 - y1) + x1)) inside = !inside;
        x0 = x1, y0 = y1;
      }
    
      return inside;
    })

    console.warn('prepaint',centroids)

// needs to be fill or line depending on the mode

mapobject.setFilter("oa11_boundaries", ["in", "id", ...centroids]);


      // mapobject.setPaintProperty("oa11_boundaries", "line-color", [
      //   "match",
      //   // ["get", "id"],
      //   // ["literal", ...centroids],
      //   // centroids,
      //   ['get', 'areas'],
      //   ['literal',[...centroids]],
      //   // centroids,
      //   "orange",
      //   "green"
      // ]);

      // mapobject.setPaintProperty("oa11_boundaries", "line-color", [
      //   "case",
      //   ['within',geojson],
      //   "orange",
      //   "green"
      // ]);

    /*
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


*/
    

  }

  mapobject.on('zoom',()=> console.log('zoomend',mapobject.getZoom()))
  



}











/// main    
onMount(init)