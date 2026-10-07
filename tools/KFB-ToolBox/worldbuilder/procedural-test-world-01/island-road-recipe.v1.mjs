// Authored route intent for the bounded R4 island. All geometry compiles in Track Core.
export function islandRoadRecipe(TC){
 const graph={schema:'kfb.route-graph/0.1-draft',id:'island.r4.village-coast',defaults:{widthClass:'NARROW',markings:'STREET',biome:'city',autoBank:{gain:0,limitDeg:0}},nodes:[{type:'ROUNDABOUT',id:'village.circle',center:[-35,.6,0],island:12,ringWidth:'NARROW',armWidth:'NARROW',fillet:6,splitter:0,armLength:9,arms:[{id:'south',at:0},{id:'north',at:180},{id:'village',at:270}]}],routes:[]};
 const sockets=TC.compileGraph(graph).sockets;
 graph.routes.push({id:'coast.loop',start:{socket:'village.circle/north'},pieces:[{id:'north.bend',type:'CURVE_EASE',turn:-180,radius:26,bankDeg:0},{id:'coast.straight',type:'STRAIGHT',markings:'TRACK',skin:'track',length:2*sockets['village.circle/north'].p[2]+12},{id:'south.bend',type:'CURVE_EASE',markings:'STREET',skin:'street',turn:-180,radius:26,bankDeg:0},{id:'south.join',type:'CONNECT',to:'village.circle/south'}]});
 graph.traversal={id:'island.r4.golden-loop',closed:true,parts:[{route:'village.circle.north'},{route:'coast.loop'},{route:'village.circle.south',reverse:true},{node:'village.circle',path:'south>north'}]};
 graph.islandLayout={lobes:[{xz:[-5,0],rad:66},{xz:[0,52],rad:52},{xz:[0,-62],rad:52},{xz:[-35,0],rad:45}],waterProfile:'graded-v1',spawn:[-37.7,-52],paletteZone:{id:'purple-grove',fromX:10,toX:34,grass:'#9a74cc',grass2:'#8a66bd',hill:'#8b66c2'},groves:[[40,38],[40,-43],[-62,-45]],pads:[{x:-35,z:0,r:7,h:.6},{x:-3,z:15,r:6,h:.4},{x:-3,z:-15,r:6,h:.4}]};
 return graph;
}
