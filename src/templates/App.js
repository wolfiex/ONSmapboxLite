
import { onMount } from "svelte";
import AreaMap from './AreaMap.svelte';
import Loader from './Loader.svelte';


let loaded=false


async function init(){

    loaded = true;

}



{/* <Map bind:map={map} style={mapstyle} minzoom={4} maxzoom={14} bind:zoom={mapZoom}>
	<MapSource id="oa" type="vector" url={vector.url} layer={vector.layer} promoteId={vector.id} minzoom={8} >
		{#if poplookup}
		<MapLayer
		  id="oa_fill"
			source="oa"
			sourceLayer={vector.layer}
			type="fill"
			click={true}
			hover={true}
			selected={codes['2011']}
			bind:drawing={drawing}
			on:click={clickSelect}
			{hovered}
			paint="{{
			'fill-color': ['case',
				['==', ['feature-state','selected'], true], 'rgba(0, 0, 0, 0.2)',
				'rgba(0, 0, 0, 0)'
			],
		}}" order="boundary_state" />
		{/if}
		<MapLayer id="oa_boundary" source="oa" sourceLayer={vector.layer} type="line" paint="{{
			'line-color': ['case',
				['==', ['feature-state','hovered'], true], 'rgb(0, 0, 0)',
				'rgb(128, 128, 128)'
			],
			'line-width': ['case',
				['==', ['feature-state','hovered'], true], 1,
				0.25
			],
		}}" order="boundary_country" />
	</MapSource>
	{#if centroids}
	<MapDraw on:draw={drawSelect} bind:draw={draw} bind:polygons={polygons} bind:drawing={drawing} bind:loaded={loaded} {centroids}/>
	{/if}
	{#if centroids}
	<MapSource id="centroids" type="geojson" data={centroids} promoteId="id">
		<MapLayer
		  id="centroids11"
			source="centroids"
			type="circle"
			filter={["==", "c11", true]}
			paint="{{
			'circle-color':  'rgba(0,0,0,0.5)',
			'circle-radius': [
				"interpolate", ["linear"], ["zoom"],
				9, 0.3, 14, 2
			]
		}}" minzoom={8} />
		<MapLayer
		  id="centroids01"
			source="centroids"
			type="circle"
			filter={[
				"all",
				["==", "c01", true],
				["==", "c11", false]
			]}
			paint="{{
			'circle-color':  'rgba(255,0,0,0.5)',
			'circle-radius': [
				"interpolate", ["linear"], ["zoom"],
				9, 0.3, 14, 2
			]
		}}" minzoom={8} />
	</MapSource> */}







onMount(init);
