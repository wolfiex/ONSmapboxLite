// imports
import mapboxgl, {
  Popup
} from 'mapbox-gl';
import {
  onMount
} from 'svelte';
import {
  writable,
  get
} from 'svelte/store';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import * as MapboxDrawGeodesic from 'mapbox-gl-draw-geodesic';
import DrawRectangle from 'mapbox-gl-draw-rectangle-mode';
import {
  select,
  mapsource,
  maplayer,
  mapobject,
  draw_type,
  datalayers,
  mapstyle,
  minzoom,
  maxzoom,
  location,
  maxbounds,
  level,
  zoomed
} from './mapstore.js';


//styling
import 'mapbox-gl/dist/mapbox-gl-draw.css'
import 'mapbox-gl/dist/mapbox-gl.css'

let webgl_canvas;

// in development
mapboxgl.clearStorage()


export const customselector = true

const area = 'lsoa'
const year = '2011'



//arcGIS 1000 return (oa)
//onsInspire 200 return (lsoa)
// list all layers extracted from the sources. [order]:values
//displayFieldName = wrong for areas 
// sass
// design  styling
// no ids in tiles 
// circle argorithm - AS lat and lon are different, selecting a raidus from the centre does not produce an even result 




var draw;

/// MAP creation
async function init() {
  console.warn(webgl_canvas)
  $mapobject = new mapboxgl.Map({
    container: "mapcontainer",
    style: mapstyle,
    minZoom: minzoom,
    maxZoom: maxzoom,
    maxBounds: maxbounds,
    pitch: 30,
    center: [0, 52],
    zoom: 4,
  });
  $mapobject.addControl(new mapboxgl.ScaleControl({
    position: "bottom-left"
  }));
  $mapobject.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

  // correct error - ignore 403 missing tiles
  $mapobject.on('error', e => {
    if (e.error.status != 403) console.error(e.error.status, e.error.message)
  });

  // drawing tool 
  init_draw()
  // draw_type.set('draw_polygon')
  // draw_type.set(undefined)

  $mapobject.on("load", SetLayers)

}








/// A function to define mapobject parameters.  
async function SetLayers() {

  // set the sources
  for (const [key, value] of Object.entries($mapsource)) {
    if ($mapobject.getSource(key)) $mapobject.removeSource(key)
    if (value.hasOwnProperty('data')) value.data = await value.data // for async loads
    $mapobject.addSource(key, value);
  }

  // set the layers
  for (const value of $maplayer) {
    if ($mapobject.getLayer(value.id)) $mapobject.removeLayer(value.id);
    $mapobject.addLayer(value);
  }

  // move mapobject to location
  $mapobject.fitBounds(location.bounds, {
    padding: 20
  });

}








////// GEODRAW

async function init_draw() {

  let modes = MapboxDrawGeodesic.enable(MapboxDraw.modes);
  console.warn('draws', modes)

  draw = new MapboxDraw({
    displayControlsDefault: true,
    controls: {
      trash: false,
    },
    // defaultMode: 'draw_polygon',
    modes: Object.assign(MapboxDraw.modes, {
      draw_circle: modes.draw_circle,
      draw_polygon: modes.draw_polygon,
      draw_rectangle: DrawRectangle,
      static: modes.static,
      simple_select: modes.simple_select
    }),
  });
  // mapobject.addControl(draw, 'top-left')


  $mapobject.on('draw.modechange', (event) => {
    console.log('modechange', event.mode);
  });
  $mapobject.on('draw.create', change);
  $mapobject.on('draw.update', change);
  $mapobject.on('draw.move', change);



  draw_type.subscribe(update_draw)

  function update_draw(newtype) {
    if (newtype === undefined) {
      try {
        $mapobject.removeControl(draw, 'top-right');
        $mapobject.setPaintProperty($level,
          "fill-color",
          '#206095'
        );
      } catch (e) {}
     
    } else {
      try {
        $mapobject.removeControl(draw, 'top-right');
      } catch (e) {}
      $mapobject.addControl(draw, 'top-right');
      draw.changeMode(newtype);

    }

  }



  /// create or update

  async function change(event) {
    const geojson = event.features[0];
    console.log('update', event.action, geojson);

    if (MapboxDrawGeodesic.isCircle(geojson)) {
      const center = MapboxDrawGeodesic.getCircleCenter(geojson);
      const radius = MapboxDrawGeodesic.getCircleRadius(geojson) / 100; // must divide by 100 to get accurate results
      console.log('circle', 'center', center, 'radius', radius);

      // lets space points around the centre to create a polygon

      var numberOfPoints = 20;
      var theta = 2.0 * Math.PI / numberOfPoints;

      geojson.geometry.coordinates[0] = []

      for (var i = 1; i <= numberOfPoints; i++) {
        geojson.geometry.coordinates[0].push([(radius * Math.cos(theta * i) + center[0]), (radius * Math.sin(theta * i) + center[1])])
      }

    }

    const coords = geojson.geometry.coordinates[0].map(d => proj4(wgs84, osgb, d))
    var lat = coords.map(p => p[1]);
    var lng = coords.map(p => p[0]);

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
    switch (area) {
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

    let centroids = await fetch(csource).then(r => r.json()).then(r=>
      //in polygon
    r.features.filter(function (point) {
      var n = coords.length,
        p = coords[n - 1],
        x = point.geometry.x,
        y = point.geometry.y,
        x0 = p[0],
        y0 = p[1],
        x1, y1,
        inside = false;

      for (var i = 0; i < n; ++i) {
        p = coords[i], x1 = p[0], y1 = p[1];
        if (((y1 > y) !== (y0 > y)) && (x < (x0 - x1) * (y - y1) / (y0 - y1) + x1)) inside = !inside;
        x0 = x1, y0 = y1;
      }

      return inside;
    })
    )
    
    .then(r => {
      // console.error(r);
      const id = Object.keys(r[0].attributes)[0];
      return r.map(f => f.attributes[id])
    })

    //  point in polygon

    $mapobject.setPaintProperty($level,
      "fill-color",
      ["match",
        ['get', 'AREACD'], //'OA11CD'],//AREACD
        ['literal', ...centroids],
        "orange",
        '#206095'
      ]);

    $select = centroids


    $mapobject.setLayoutProperty(
      // $mapobject.getLayer($level),
      $level,
      'visibility',
      'visible'
    );


  }

  $mapobject.on('zoom', (z) => {
    const zlevel = z.target.transform.tileZoom
    console.log('zoomend', zlevel, $zoomed)

    if (zlevel > 7 & !$zoomed) {
      console.log('ON!!')
      $zoomed = true;
      update_layers()

    } else if (zlevel < 6 & $zoomed) {
      $zoomed = false;
      update_layers()
      console.log('OFF!!')

    }

  })


  function update_layers() {

    console.log('update_layers', '$level')
    $mapobject.setLayoutProperty(
      $level, 'visibility',
      $zoomed ? 'visible' : 'none'
    );

    // $mapobject.setPaintProperty('select_layer',
    //   "fill-color", $zoomed? 'transparent':'gray'
    //   );

    $mapobject.setLayoutProperty(
      'select_layer', 'visibility',
      $zoomed ? 'none' : 'visible'
    );

  }







  var popup = new mapboxgl.Popup().addTo($mapobject);

  $mapobject.on('click', 'select_layer', (e) => {

    // popup.remove()
    // popup
    // .setLngLat(e.lngLat)
    // .setHTML(e.features[0].properties.ctyua11nm)

    console.log(e.features)


    if (!$zoomed) {
      $zoomed = true
      update_layers();
      var poly = e.features[0].properties

      $mapobject.fitBounds([
        [poly.minx, poly.miny],
        [poly.maxx, poly.maxy],
        {
          padding: 90
        }
      ])

    }

  });

  $mapobject.on('mouseenter', 'select_layer', (e) => {
    // $mapobject.getCanvas().style.cursor = 'pointer';
    if (e.features.length > 0) {

      // $mapobject.setFeatureState({
      //   source: 'selector',
      //   id: e.features[0].id
      // }, {
      //   hover: true
      // });

      popup
        .setLngLat(e.lngLat)
        .setHTML(e.features[0].properties.ctyua11nm)
      $mapobject

    }

  });


  // $mapobject.on('mouseleave', 'select_layer', (e) => {
  //   console.log(e,e.features)
  //   if (e.features.length) {

  //     $mapobject.setFeatureState({
  //       source: 'selector',
  //       id: e.features[0].id
  //     }, {
  //       hover: false
  //     });

  //     popup
  //       .setLngLat(e.lngLat)
  //       .setHTML(e.features[0].properties.ctyua11nm)
  //     $mapobject
  //   }
  // })



}





// reprojection

import proj4 from 'proj4';
const osgb = '++proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs ';
const wgs84 = '+proj=longlat +datum=WGS84 +no_defs ';

/// main    
onMount(init)