# Image analysis — bridge01 (reference: reference.jpg, 360x360 CC0 thumbnail)

L1 Identification: single-span segmental stone arch bridge (footbridge / road bridge), low-poly game prop
render (not a photo). Classification: architectural structure / furnishing-scale game prop.
primaryDomain=object, confidence 0.9.

L2 Form & silhouette: bounding volume ~ elongated cuboid (length ≈ 2.2 × width, height ≈ 0.8 × width).
Bilateral symmetry across the longitudinal mid-plane AND across the transverse mid-plane (span centre).
Shape language geometric/blocky in the reference; KFB target re-styles it organic/clay (rounded).
Deck is a gently cambered (segmental, rising) profile, highest at mid-span.

L3 Decomposition:
- macro: arch barrel (vault with intrados), 2 spandrel walls, 2 abutments (cuboid piers on each end, wider
  than the deck), deck (walkway slab), 2 parapets.
- meso: arch ring (voussoir course along the face, visible as a thicker ring), deck plank/slab courses
  (transverse bands at the near end), parapet coping blocks (stepped stones along the parapet top),
  abutment block masonry.
- micro: masonry bond texture (herringbone-like brick pattern on abutments & spandrels), coping step
  joints, plank joints.

L4 Spatial relationships: <arch barrel, springs-from, abutment inner faces> (embed);
<spandrel walls, sit-on, arch extrados> (butt/flush); <deck, rests-on, spandrel walls + arch crown> (overlap);
<parapets, attached-to, deck lateral edges> (butt, on top); <abutments, embedded-in, ground> (embed).

L5 Materials: one dielectric masonry material, matte (roughness ≈ 0.9, metalness 0), light beige-grey
albedo, relief = brick/block joints. Opaque. Deck top slightly lighter value.
KFB override: 4 warm light stone tones #e6d4b5 #d1ba99 #b29c7d #9e856b, road #545e7a.

L6 Colour & finish: low-saturation warm grey, high value (~0.75); matte. Shadow under arch is lighting,
not albedo.

L7 Identity-defining features: (1) single round/segmental arch opening through the full width;
(2) cambered/humped deck; (3) solid boxy abutments projecting beyond the deck width at both ends;
(4) parapets with stepped coping running the full length; (5) arch ring visible on the face.

L8 Uncertainty: far side (back face) hidden — assumed mirror of near face; underside of vault only
partially visible (intrados assumed smooth barrel); far abutment occluded; ground interface unknown;
the reference is a stylized low-poly model at small resolution, so masonry detail is uncertain.
Reference is a 3/4 isometric-like view (orthographic-looking) from upper-front-right.
