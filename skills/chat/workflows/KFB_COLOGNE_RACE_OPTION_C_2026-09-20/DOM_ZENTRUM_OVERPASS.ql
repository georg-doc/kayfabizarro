/*
KFB Cologne Race · Dom/Zentrum OSM intake
Date: 2026-09-20

PURPOSE
- Real OSM geography for the first Dom Loop.
- This query is a source-data request, not authored scene geometry.
- Save the raw JSON response unchanged before deriving any consumer scene.

PILOT BBOX
south,west,north,east
50.9325,6.9460,50.9515,6.9785

The bbox is a KFB pilot selection intended to cover Dom/HBF, adjacent Altstadt
and Rhine-bank context. If review shows a required route feature outside the box,
expand the bbox explicitly and record the change; never silently invent geometry.

OSM / ODbL
Preserve OSM attribution and the raw-source timestamp/endpoint in SOURCE.json.
*/

[out:json][timeout:120][bbox:50.9325,6.9460,50.9515,6.9785];

(
  /* Road / path network */
  way["highway"];
  relation["highway"];

  /* Buildings and major structure footprints */
  way["building"];
  relation["building"];

  /* HBF and rail topology: future Track candidates, not ordinary roads */
  way["railway"];
  relation["railway"];

  /* Rhine / water context */
  way["waterway"];
  relation["waterway"];
  way["natural"="water"];
  relation["natural"="water"];
  way["water"="river"];
  relation["water"="river"];

  /* Bridges and tunnels matter to route topology */
  way["bridge"];
  relation["bridge"];
  way["tunnel"];
  relation["tunnel"];

  /* Landmark / POI semantics for exact overrides */
  nwr["tourism"];
  nwr["historic"];
  nwr["amenity"];
  nwr["man_made"];
  nwr["place_of_worship"];
  nwr["name"~"Kölner Dom|Cologne Cathedral|Köln Hauptbahnhof|Hauptbahnhof Köln|Hohenzollernbrücke|Deutzer Brücke|Rhein",i];
);

out body geom;
