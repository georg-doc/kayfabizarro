[out:json][timeout:120];
(
  /* Roads and paths */
  way["highway"](50.9325,6.9460,50.9515,6.9785);

  /* Buildings */
  way["building"](50.9325,6.9460,50.9515,6.9785);
  relation["building"](50.9325,6.9460,50.9515,6.9785);

  /* Surface / parks / water */
  way["landuse"](50.9325,6.9460,50.9515,6.9785);
  relation["landuse"](50.9325,6.9460,50.9515,6.9785);
  way["leisure"](50.9325,6.9460,50.9515,6.9785);
  relation["leisure"](50.9325,6.9460,50.9515,6.9785);
  way["natural"](50.9325,6.9460,50.9515,6.9785);
  relation["natural"](50.9325,6.9460,50.9515,6.9785);
  way["water"](50.9325,6.9460,50.9515,6.9785);
  relation["water"](50.9325,6.9460,50.9515,6.9785);
  way["waterway"](50.9325,6.9460,50.9515,6.9785);
  relation["waterway"](50.9325,6.9460,50.9515,6.9785);

  /* HBF / rail network */
  way["railway"](50.9325,6.9460,50.9515,6.9785);
  relation["railway"](50.9325,6.9460,50.9515,6.9785);

  /* Named POI semantics for later exact landmark overrides */
  nwr["name"]["tourism"](50.9325,6.9460,50.9515,6.9785);
  nwr["name"]["historic"](50.9325,6.9460,50.9515,6.9785);
  nwr["name"]["amenity"](50.9325,6.9460,50.9515,6.9785);
  nwr["name"]["man_made"](50.9325,6.9460,50.9515,6.9785);
  nwr["amenity"="place_of_worship"](50.9325,6.9460,50.9515,6.9785);

  /* Explicit hero names for robust discovery */
  nwr["name"~"Kölner Dom|Cologne Cathedral|Köln Hauptbahnhof|Hauptbahnhof Köln|Hohenzollernbrücke|Deutzer Brücke|Rhein",i]
    (50.9325,6.9460,50.9515,6.9785);
);
out body;
>;
out skel qt;
