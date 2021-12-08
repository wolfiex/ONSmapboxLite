# Map

The map has been refactored to make it easier to use. There is no html in the MapComponent.svelte components which makes
this relaltively easy

The intent has been to refactor maps so that as much config as possible is either inherited using `getContext` or picked
up from config

This makes it relatively easy to work out what is going on with the Map

## Map 1

This is a map which is pulling from one tile set.
`<BoundaryLayer>` renders the borders of its parent TileSet. Setting `<BoundaryLayer paint={example}>` lets us customise the boundaries

```html
<map>
  <TileSet id="lad" type="vector" url="{exampleUrl}">
    <BoundaryLayer id="lad-boundaries" />
  </TileSet>
</map>
```

## Map 2

This map renders two new layers. `<DataLayer />` is what renders the data. `<InteractiveLayer />` gives two callbacks which we can use to update our datastores.

```html
<map>
  <TileSet id="lad" type="vector" url="{exampleUrl}">
    <DataLayer id="lad-data" data="{categoryData}" />
    <BoundaryLayer id="lad-boundaries" />
    <InteractiveLayer id="lad-interactive-layer" onSelect={(code)=>{updateSelectedGeography(code)}}
    onHover={(code)=>{updateHoveredGeography(code)}} />
  </TileSet>
</map>
```

## Map 3

This is where life gets interesting. By setting `minzoom` and `maxzoom` we control when layers and tile sets are visible

In this example if you are zoomed out the lad level data is rendered.
When you zoom in above 9 the lad layers are hidden and the more detailed
lsoa data becomes active.

```html
<map>
  <TileSet id="lad" type="vector" url="{ladUrl}" maxzoom="{9}">
    <DataLayer id="lad-data" data="{categoryData}" />
    <BoundaryLayer id="lad-boundaries" />
    <InteractiveLayer id="lad-interactive-layer" onSelect={(code)=>{updateSelectedGeography(code)}}
    onHover={(code)=>{updateHoveredGeography(code)}} />
  </TileSet>

  <TileSet id="lsoa" type="vector" url="{lsoaUrl}" minzoom="{9}">
    <DataLayer id="lsoa-data" data="{categoryData}" />
    <BoundaryLayer id="lsoa-boundaries" />
    <InteractiveLayer id="lsoa-interactive-layer" onSelect={(code)=>{updateSelectedGeography(code)}}
    onHover={(code)=>{updateHoveredGeography(code)}} />
  </TileSet>
</map>
```
