import {
	onMount
} from "svelte";
import {
	default as AreaMap
} from './AreaMap.svelte';
import {
	select,
	mapsource,
	maplayer,
	mapobject,
	draw_type,
	levels,
	level,
	zoomed
} from './mapstore.js'
import Loader from './Loader.svelte';
import { get } from 'svelte/store';

// design system
import BasePage from "./ui/BasePage.svelte";
import Header from "./ui/Header.svelte";
import DesignSystemPanel from "./ui/DesignSystemPanel.svelte";
import ONSBacklink from './ui/ons/ONSBacklink.svelte';
import UseCensusData from './ui/ons/ONSBacklink.svelte';
import ONSRadios from './ui/ons/ONSRadios.svelte';
import ONSRadio from './ui/ons/partials/ONSRadio.svelte';
import ONSCard from './ui/ons/ONSCard.svelte';
import ONSTextArea from './ui/ons/ONSTextArea.svelte';
import CategorySelector from './ui/CategorySelector.svelte';
import '../node_modules/normalize.css'

import Panel from './Panel.svelte';
// import AreaMap ,{ draw_type } from ".s/AreaMap";

let loaded = false


async function init() {

	loaded = true;
	$draw_type = 'simple_select'


}

console.error($select)

$levels = [{
		id: 'oa',
		layerid: 'oa_layer',
		name: 'Output Areas',
		url: (bboxosm) => `https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/Output_Areas_December_${year}_Population_Weighted_Centroids/FeatureServer/0/query?f=json&returnIdsOnly=false&returnCountOnly=false&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=${[bboxosm[0].join(','),bboxosm[1].join(',')].join(',')}&where=1=1`
	},

	{
		id: 'msoa',
		layerid: 'msoa_layer',
		name: 'Medium Layer Super Output Area',
		url: (bboxosm) => `geometry=${[bboxosm[0].join(','),bboxosm[1].join(',')].join(',')}&maxRecordCount=10000`
	},

	{
		id: 'lsoa',
		layerid: 'lsoa_layer',
		name: 'Lower Layer Super Output Area',
		url: (bboxosm) => `https://ons-inspire.esriuk.com/arcgis/rest/services/Census_Boundaries/Lower_Super_Output_Areas_December_${year}_Centroids/MapServer/0/query?f=json&returnIdsOnly=false&returnCountOnly=false&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=${[bboxosm[0].join(','),bboxosm[1].join(',')].join(',')}&maxRecordCount=10000`
	}
]




$mapsource = {
	'selector': {
		'type': 'geojson',
		'data': fetch('https://wolfiex.github.io/ONStileBuilder/tiles/CountiesUA.geojson').then(r => r.json()).then(r => {
			delete r.crs;
			return r
		}),
		// promoteId: { layer_name: 'select_data'}
	},

	//   'tiles':['https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tilemap/2/0/0/32/32?f=json']
	//     tiles: ["https://cdn.ons.gov.uk/maptiles/t9/{z}/{x}/{y}.pbf"],

	"oa": {
		type: "vector",
		tiles: ["https://cdn.ons.gov.uk/maptiles/administrative/lsoa/v1/boundaries/{z}/{x}/{y}.pbf"],
		// promoteId: { OA_bound_ethnicity: "oa11cd" }
	},

	"oa11s": {
		type: "vector",
		tiles: ["https://wolfiex.github.io/ONStileBuilder/tiles/tileserver/{z}/{x}/{y}.pbf"],
		//   layer: "OA11",
		//   id: "oa11cd"
	}

};


$maplayer = [
	{
		id: "select_layer",
		type: "fill",
		source: "selector",
		paint: {
			"fill-color": 'gray',
			'fill-outline-color': '#232',
			'fill-opacity': [
				'case',
				['boolean', ['feature-state', 'hover'], false],
				.9,
				0.4
				]
		},

	},

	{
		id: "oa",
		type: "fill",
		source: "oa",
		"source-layer": "boundaries",
		paint: {
			"fill-color": ["match",
				['get', 'AREACD'],
				['literal', ...$select],
				'green',
				'#206095',
			],
			'fill-opacity': 0.4,
			'fill-outline-color': 'whitesmoke',
		},
		"light": {
			"anchor": "viewport",
			"color": "white",
			"intensity": 0.3
		},
		'layout': {
			'visibility': 'none'
		},
	},

	{
		id: "select_outline",
		type: "line",
		source: "selector",
		paint: {
			'line-color': '#232',
			'line-width': 1.5,
			'line-opacity': .5
		},

	},

]







onMount(init);