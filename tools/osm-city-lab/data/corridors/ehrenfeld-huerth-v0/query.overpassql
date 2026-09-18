[out:json][timeout:60];
(
  way["highway"~"^(trunk|primary|secondary|tertiary|unclassified|residential|living_street|service)$"](50.854,6.855,50.961,6.938);
);
out body;
>;
out skel qt;
