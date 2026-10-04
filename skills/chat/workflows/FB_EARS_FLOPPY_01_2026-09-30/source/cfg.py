ENV=dict(sagShare=[0.65,0.25,0.10],maxFwd=[72,30,25],maxBack=[40,25,25],maxRoll=[30,15,10])
CFG={
 'today (Georg: Floppy preset, gravity 0, no wind input)':dict(dangle=1.5,stiff=1,damp=0.8,gravity=0),
 'A · Perky':dict(dangle=1.0,damp=1.1,gravity=0.25,sagFrom=25,inertia=1.0,spin=1.0,bob=3,wind=1,**ENV),
 'B · Floppy':dict(dangle=1.4,damp=1.1,gravity=0.4,sagFrom=25,inertia=1.2,spin=1.0,bob=5,wind=1.5,**ENV),
 'C · Rag':dict(dangle=1.8,damp=0.95,gravity=0.5,sagFrom=25,inertia=1.4,spin=1.2,bob=7,wind=2,**ENV),
}
