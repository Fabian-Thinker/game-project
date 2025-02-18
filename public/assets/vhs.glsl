#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
uniform sampler2D uMainSampler;

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;

    // Flip the Y-axis to account for canvas orientation
    uv.y = 1.0 - uv.y;

    // Scanline effect
    float scanline = sin(uv.y * 400.0 + time * 5.0) * 0.03;

    // RGB Chromatic Aberration
    vec3 col;
    col.r = texture2D(uMainSampler, uv + vec2(scanline, 0.0)).r;
    col.g = texture2D(uMainSampler, uv).g;
    col.b = texture2D(uMainSampler, uv - vec2(scanline, 0.0)).b;

    // Slight Noise
    float noise = fract(sin(dot(uv, vec2(12.9898,78.233))) * 43758.5453);
    col *= 0.95 + 0.05 * noise;

    gl_FragColor = vec4(col, 1.0);
}