// Coordinates are registered to the canonical 5504 × 3072 composition.
export function PersonaArtwork(site) {
  if (!site.personaImage) return "";
  const escape = (value) =>
    String(value).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const picture = (overlay = false) =>
    `<picture${overlay ? ' class="persona-flower-light" aria-hidden="true"' : ""}><source media="(max-width: 600px)" srcset="/assets/persona-mobile-640.jpg 640w, /assets/persona-mobile-960.jpg 960w" sizes="calc(100vw - 48px)" width="960" height="1200"><img ${overlay ? 'alt=""' : 'alt="' + escape(site.personaAlt) + '"'} src="${escape(site.personaImage)}" srcset="/assets/persona-960.jpg 960w, /assets/persona-1600.jpg 1600w, /assets/persona-2400.jpg 2400w" sizes="(max-width: 600px) calc(100vw - 48px), (max-width: 1100px) 90vw, 1100px" width="5504" height="3072" decoding="async" ${overlay ? "" : 'fetchpriority="high"'}></picture>`;
  return `<figure class="persona-composition" data-persona><div class="persona-scene">${picture()}${picture(true)}<svg class="persona-illumination" viewBox="0 0 2048 1143" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><defs><radialGradient id="persona-candle-glow"><stop stop-color="#f4d7b7" stop-opacity=".22"/><stop offset=".28" stop-color="#efcbb0" stop-opacity=".08"/><stop offset="1" stop-color="#efcbb0" stop-opacity="0"/></radialGradient></defs><g class="persona-candles" fill="url(#persona-candle-glow)"><ellipse class="persona-candle" cx="638" cy="512" rx="110" ry="195"/><ellipse class="persona-candle" cx="1435" cy="512" rx="105" ry="190"/></g></svg><button type="button" id="persona-cresson" class="persona-cresson" data-cresson data-persona-cresson aria-label="Cresson flower"><svg class="persona-center" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><defs><radialGradient id="persona-center-glow"><stop stop-color="#9b344c" stop-opacity=".65"/><stop offset=".5" stop-color="#92334c" stop-opacity=".2"/><stop offset="1" stop-color="#92334c" stop-opacity="0"/></radialGradient></defs><ellipse class="persona-center-color" cx="50" cy="46" rx="23" ry="25" fill="url(#persona-center-glow)"/><g class="persona-center-rings" fill="none" stroke="#bb879c" stroke-width=".5" opacity=".2"><path d="M37 39a15 15 0 1 1 5 21 M31 47a20 20 0 0 1 28-18 M68 55a20 20 0 0 1-21 12"/></g></svg></button></div><figcaption class="micro">Seems that this website has some hidden secrets...</figcaption></figure>`;
}
