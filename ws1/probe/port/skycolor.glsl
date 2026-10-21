
  uniform vec3 uZenith, uSkyMid, uSkyGround, uSunDir, uSunCol, uAntiTint, uAirTint; uniform float uHzGlow, uSunHalo, uSky2, uFogB, uFogHa, uFogHb, uEdgeR, uSGrad, uKul; uniform vec3 uEdgeSun, uEdgeAnti; uniform vec2 uAirOff;
  vec3 skyColor(vec3 d){
    float y=d.y;
    vec3 up=mix(uHorizon, uSkyMid, smoothstep(0.0,0.208,y)); up=mix(up, uZenith, smoothstep(0.208,0.82,y));
    vec3 dn=mix(uHorizon, uSkyGround, smoothstep(0.0,0.174,-y));            /* Bodendunst 0° … −10° statt Fläche (H5) */
    vec3 c=y>=0.0 ? up : dn;
    c+=uHzGlow*exp(-abs(y)*20.0)*uHorizon;                                    /* Horizont = hellste Linie (H2) */
    float sd=dot(d,uSunDir);
    c=mix(c, uSunCol, uSunHalo*pow(max(sd,0.0),8.0)*(1.0-smoothstep(0.0,0.6,y)));   /* Sonnenhof (H1) */
    c*=mix(vec3(1.0), uAntiTint, 0.5*max(-sd,0.0));                          /* Gegenseite kühler */
    /* Cartoon-Verlauf quer über den Himmel (Georg 21.10., Idee wie tinyskies/Looney Tunes): zur Sonne hin warm und hell, gegenüber tiefer und kühler.
       Weil Nebel = Himmel ist, folgt der Dunst automatisch mit. */
    float az=dot(normalize(d.xz+1e-5), normalize(uSunDir.xz+1e-5))*0.5+0.5, yl=max(y,0.0);
    float lowS=1.0-smoothstep(0.0,0.55,yl), lowA=1.0-smoothstep(0.0,0.85,yl);
    c=mix(c, mix(uHorizon,uSunCol,0.6)*1.05, uSGrad*0.6*az*az*lowS*lowS);
    c=mix(c, c*vec3(0.84,0.89,1.04), uSGrad*0.45*(1.0-az)*lowA);
    return c;
  }
