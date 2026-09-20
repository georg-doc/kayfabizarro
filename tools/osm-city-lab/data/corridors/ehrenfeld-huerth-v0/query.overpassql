[out:json][timeout:40];
(
  way["highway"~"^(trunk|primary|secondary|tertiary|unclassified)$"](50.854,6.855,50.961,6.938);
);
out body;
>;
out skel qt;
