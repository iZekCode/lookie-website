// The big cute eye used by the opening and by every animal: a round white, a large glossy pupil, two sparkles.
// The shared gradients live in `eyeDefs`, which is rendered once on the page.
export const eyeDefs = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
<radialGradient id="ce-white" cx="42%" cy="34%" r="78%"><stop offset="0.55" stop-color="#ffffff"/><stop offset="0.9" stop-color="#f2effb"/><stop offset="1" stop-color="#d9d3ee"/></radialGradient>
<radialGradient id="ce-pupil" cx="40%" cy="30%" r="85%"><stop offset="0" stop-color="#43315f"/><stop offset="0.4" stop-color="#1a1228"/><stop offset="1" stop-color="#050309"/></radialGradient>
</defs></svg>`;

export const eyeSvg = `<svg class="eye-svg" viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<ellipse class="sclera" cx="100" cy="130" rx="96" ry="126" fill="url(#ce-white)"/>
<g class="pupil">
<ellipse cx="104" cy="140" rx="64" ry="80" fill="url(#ce-pupil)"/>
<ellipse cx="128" cy="100" rx="22" ry="25" fill="#fff"/>
<circle cx="80" cy="176" r="10" fill="#fff" opacity="0.95"/>
<circle cx="140" cy="168" r="4.5" fill="#fff" opacity="0.8"/>
</g>
</svg>`;
