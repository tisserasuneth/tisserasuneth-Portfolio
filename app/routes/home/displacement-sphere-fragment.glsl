#define PHONG

uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;

uniform float time;
varying vec2 vUv;
varying vec3 newPosition;
varying float noise;

#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

vec3 reduceSaturation(vec3 color, float saturationFactor) {
    // Compute the grayscale (luminance) of the color
    float gray = dot(color, vec3(0.3, 0.59, 0.11));
    // Blend between the grayscale and the original color
    return mix(vec3(gray), color, saturationFactor);
}

void main() {

    #include <clipping_planes_fragment>

    vec3 color = vec3(vUv * (0.2 - 4.5 * noise), 3.0);
    vec3 finalColors = vec3(color.b * 1.5, color.r * 1.8, color.g * 0.8);
    vec3 saturatedColors = cos(finalColors * noise * 3.0);

    // Reduce saturation slightly
    float saturationFactor = 0.9; // Adjust this factor to reduce saturation
    vec3 adjustedColors = reduceSaturation(saturatedColors, saturationFactor);

    vec4 diffuseColor = vec4(adjustedColors, 1.0);
    ReflectedLight reflectedLight = ReflectedLight(vec3(0.0), vec3(0.0), vec3(0.0), vec3(0.0));
    vec3 totalEmissiveRadiance = emissive;

    #include <logdepthbuf_fragment>
    #include <map_fragment>
    #include <color_fragment>
    #include <alphamap_fragment>
    #include <alphatest_fragment>
    #include <alphahash_fragment>
    #include <specularmap_fragment>
    #include <normal_fragment_begin>
    #include <normal_fragment_maps>
    #include <emissivemap_fragment>

    // accumulation
    #include <lights_phong_fragment>
    #include <lights_fragment_begin>
    #include <lights_fragment_maps>
    #include <lights_fragment_end>

    // modulation
    #include <aomap_fragment>

    vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;

    #include <envmap_fragment>
    #include <opaque_fragment>
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    #include <fog_fragment>
    #include <premultiplied_alpha_fragment>
    #include <dithering_fragment>

    // Add a thin overlay layer
    vec4 overlayColor = vec4(0.0, 0.0, 0.0, 0.3);
    gl_FragColor = mix(vec4(outgoingLight, diffuseColor.a), overlayColor, overlayColor.a);
}
