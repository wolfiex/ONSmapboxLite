
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

// in development
mapboxgl.clearStorage()


import proj4 from 'proj4';
const osgb = '++proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs ';
const wgs84 = '+proj=longlat +datum=WGS84 +no_defs ';

export const customselector = true
export const draw_type = writable(undefined);
export const datalayers = writable(['centroids']);


//Main mapobject style
export let mapstyle = "https://bothness.github.io/ons-basemaps/data/style-omt.json"


const area = 'oa'
const year = '2011'


/// list all sources here [name]:values
export let mapsource = {   
  
    // 'oa': {
    //   'type': 'vector',
    //   'tiles':['https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tilemap/2/0/0/32/32?f=json']
    // },

    // "oa": {
    //     type: "vector",
    //     tiles: ["https://cdn.ons.gov.uk/maptiles/t9/{z}/{x}/{y}.pbf"],
    //     // promoteId: { OA_bound_ethnicity: "oa11cd" }
    //   },

   "oa": {
        type: "vector",
        tiles: ["https://cdn.ons.gov.uk/maptiles/administrative/lsoa/v1/boundaries/{z}/{x}/{y}.pbf"],
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


// "circle-color": ["in", 1, ["literal", [1, 2, 3]]]

var select = ['E01022222','E00099330', 'E00099119', 'E00099346', 'E00151858', 'E00099180', 'E00099221', 'E00099131', 'E00099245', 'E00099291', 'E00099178', 'E00099351', 'E00099279', 'E00151873', 'E00099256', 'E00099287', 'E00099223', 'E00099140', 'E00150132', 'E00151748', 'E00172339', 'E00151892', 'E00099166', 'E00099193', 'E00099345', 'E00151888', 'E00099100', 'E00099316', 'E00099190', 'E00098146', 'E00099304', 'E00099265', 'E00151752', 'E00151905', 'E00099184', 'E00174337', 'E00099176', 'E00098140', 'E00099806', 'E00151756', 'E00099266', 'E00151944', 'E00151780', 'E00099253', 'E00099240', 'E00099319', 'E00151876', 'E00099132', 'E00099296', 'E00099116', 'E00099335', 'E00099749', 'E00151827', 'E00099289', 'E00151875', 'E00099194', 'E00099137', 'E00099183', 'E00151824', 'E00099173', 'E00099280', 'E00099110', 'E00151885', 'E00099340', 'E00099348', 'E00099163', 'E00099177', 'E00099185', 'E00151889', 'E00099203', 'E00099267', 'E00099272', 'E00099247', 'E00099106', 'E00151829', 'E00099250', 'E00099196', 'E00151945', 'E00151758', 'E00151820', 'E00099332', 'E00099241', 'E00099209', 'E00099339', 'E00150138', 'E00151833', 'E00099134', 'E00099297', 'E00099103', 'E00151883', 'E00151872', 'E00099224', 'E00099123', 'E00099191', 'E00151860', 'E00099283', 'E00099347', 'E00099200', 'E00099284', 'E00099302', 'E00099328','E01006350', 'E01006411', 'E01006369', 'E01006256', 'E01006257', 'E01006254', 'E01006255', 'E01006253', 'E01006258', 'E01006392', 'E01006310', 'E01006391', 'E01006311', 'E01006390', 'E01006236', 'E01006234', 'E01006235', 'E01006231', 'E01006306', 'E01006387', 'E01006307', 'E01006386', 'E01006305', 'E01006308', 'E01006389', 'E01006388', 'E01006260', 'E01004894', 'E01006374', 'E01006375', 'E01006372', 'E01006373', 'E01006370', 'E01006371', 'E01004895', 'E01010387', 'E01010386', 'E01010385', 'E01010384', 'E01010389', 'E01010388', 'E01010264', 'E01010265', 'E01010262', 'E01010263', 'E01010260', 'E01010261', 'E01010269', 'E01010406', 'E01010404', 'E01010405', 'E01010402', 'E01010403', 'E01010401', 'E01010372', 'E01010373', 'E01010370', 'E01010371', 'E01010455', 'E01010452', 'E01010336', 'E01010332', 'E01010333', 'E01010330']

//arcGIS 1000 return (oa)
//onsInspire 200 return (lsoa)


// list all layers extracted from the sources. [order]:values
export let maplayer = [
        {
            id: "lsoa_boundary",
            type:  "fill-extrusion",
            source:  "oa",
            "source-layer":  "boundaries",
            paint: {
              //'feature-state','selected'], true], 'rgba(0, 0, 0, 0.2)',
              "fill--color": 
              ["match",
              ['get','AREACD'],
              ['literal', ...select],
               'green', 
              "steelblue",
            ],
              
            },
            "light": { // shading light
              "anchor": "viewport",
              "color": "white",
              "intensity": 0.4
            }
        },

        {
          id: "oa_boundary",
          type:  "fill-extrusion",
          source:  "oa",
          "source-layer":  "boundaries",
          paint: {
            //'feature-state','selected'], true], 'rgba(0, 0, 0, 0.2)',
            "fill-extrusion-color": 
            ["match",
            ['get','AREACD'],
            ['literal', ...select],
             'green', 
            "steelblue",
          ],
            "fill-extrusion-height": ['literal',1000*Math.random()],
            // ],
          },
          "light": { // shading light
            "anchor": "viewport",
            "color": "white",
            "intensity": 0.4
          }
      },






      //   {
      //     id: "oa_boundary",
      //     type:  "fill-extrusion",
      //     source:  "oa",
      //     "source-layer":  "OA_bound_ethnicity",
      //     paint: {
      //       //'feature-state','selected'], true], 'rgba(0, 0, 0, 0.2)',
      //       "fill-extrusion-color": ['match"steelblue","fill-extrusion-height": ['literal',1000*Math.random()],
      //       // ],
      //     },
      //     "light": { // shading light
      //       "anchor": "viewport",
      //       "color": "white",
      //       "intensity": 0.4
      //     }
      // },
        // {
        //     id: "oa11_boundaries",
        //     type:  "line",
        //     source:  "oa11s",
        //     "source-layer":  "areas",
        //     paint: {
        //       //'feature-state','selected'], true], 'rgba(0, 0, 0, 0.2)',
        //       "line-color": "red"
        //       // ],
        //     }
        // },
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

    let csource;
    switch(area) {
      case 'lsoa':
        // code block
        csource = `https://ons-inspire.esriuk.com/arcgis/rest/services/Census_Boundaries/Lower_Super_Output_Areas_December_${year}_Centroids/MapServer/0/query?f=json&returnIdsOnly=false&returnCountOnly=false&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=${[bboxosm[0].join(','),bboxosm[1].join(',')].join(',')}&maxRecordCount=10000`

        break;
      case 'oa':
        csource = `https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/Output_Areas_December_${year}_Population_Weighted_Centroids/FeatureServer/0/query?f=json&returnIdsOnly=false&returnCountOnly=false&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=${[bboxosm[0].join(','),bboxosm[1].join(',')].join(',')}&where=1=1`
        break;
      default:
        // code block
    }

    console.warn(csource)

    let centroids = await fetch(csource).then(r=>r.json()).then(r=>{console.error(r);const id = Object.keys(r.features[0].attributes)[0
    ]; return r.features.map(f=>f.attributes[id])})
    
    //.then(r=>{console.error(r);const id = r.displayFieldName; return r.features.map(f=>f.attributes[id])})

    // console.warn('bbox',[bboxosm[0].join(','),bboxosm[1].join(',')].join(','),centroids)

    point in polygon
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

// console.warn('rendered',mapobject.queryRenderedFeatures())

// needs to be fill or line depending on the mode

// mapobject.setFilter("oa11_boundaries", ["in", "id", ...centroids]);


      mapobject.setPaintProperty("oa_boundary",
        "fill-extrusion-color",
        ["match",
        ['get','AREACD'],
        ['literal', ...centroids],
        "orange",
        "green"
      ]);

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

  // mapobject.on('zoom',()=> console.log('zoomend',mapobject.getZoom()))
  



}











/// main    
onMount(init)