export function createWorldMaterialSystem(THREE){
  const rimColor=new THREE.Color('#ffeebb');
  const patched=new Set();

  function patchRim(material,intensity=.5,power=2.7){
    if(patched.has(material))return material;
    patched.add(material);
    material.userData.kfbRim={intensity,power};
    const prior=material.onBeforeCompile?.bind(material);
    material.onBeforeCompile=(shader,renderer)=>{
      prior?.(shader,renderer);
      shader.uniforms.kfbRimColor={value:rimColor};
      shader.uniforms.kfbRimIntensity={value:intensity};
      shader.uniforms.kfbRimPower={value:power};
      shader.fragmentShader=shader.fragmentShader
        .replace('#include <common>','#include <common>\nuniform vec3 kfbRimColor;\nuniform float kfbRimIntensity;\nuniform float kfbRimPower;')
        .replace('#include <dithering_fragment>',`vec3 kfbRimView=normalize(vViewPosition);
vec3 kfbRimNormal=normalize(normal);
float kfbRimF=1.0-abs(dot(kfbRimView,kfbRimNormal));
gl_FragColor.rgb += kfbRimColor*kfbRimIntensity*pow(kfbRimF,kfbRimPower);
#include <dithering_fragment>`);
    };
    material.needsUpdate=true;
    return material;
  }

  function phong(options={},rim=.5,power=2.7){
    const mat=new THREE.MeshPhongMaterial({flatShading:true,shininess:15,...options});
    return patchRim(mat,rim,power);
  }

  function standard(options={},rim=.42,power=2.8){
    const mat=new THREE.MeshStandardMaterial({flatShading:true,roughness:.88,metalness:0,...options});
    return patchRim(mat,rim,power);
  }

  function setRim(value){rimColor.set(value);}
  function dispose(){for(const mat of patched)mat.dispose();patched.clear();}

  return {rimColor,patchRim,phong,standard,setRim,dispose};
}
