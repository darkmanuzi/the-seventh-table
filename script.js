const reservations = [
  {n:'I',title:'Italian Sunset',city:'Rome',country:'Italy',lat:41.9028,lon:12.4964,copy:'Where the journey began. Slow evenings, fine cuisine and unforgettable sunsets.',url:'https://distrokid.com/hyperfollow/theseventhtable/reservation-i--italian-sunset?ref=release',release:'2026-07-13',available:true},
  {n:'II',title:'Paris Bistro',city:'Paris',country:'France',lat:48.8566,lon:2.3522,copy:'Classic Parisian charm, intimate conversations and timeless elegance.',url:'https://distrokid.com/hyperfollow/theseventhtable/reservation-ii---paris-bistro?ref=release',release:'2026-07-14',available:true},
  {n:'III',title:'Santorini Evening',city:'Santorini',country:'Greece',lat:36.3932,lon:25.4615,copy:'White architecture, blue horizons and the calm of the Aegean Sea at dusk.',url:'https://distrokid.com/hyperfollow/theseventhtable/reservation-iii---santorini-evening?ref=release',release:'2026-07-15',available:true},
  {n:'IV',title:'Spanish Terrace',city:'Madrid',country:'Spain',lat:40.4168,lon:-3.7038,copy:'A warm Mediterranean evening filled with wine, laughter and golden sunsets.',url:'https://distrokid.com/hyperfollow/theseventhtable/reservation-iv--spanish-terrace?ref=release',release:'2026-07-16',available:true},
  {n:'V',title:'Lisbon Alfresco',city:'Lisbon',country:'Portugal',lat:38.7223,lon:-9.1393,copy:'Sunlit terraces, Atlantic breezes and relaxed afternoons overlooking the old city.',url:'https://distrokid.com/hyperfollow/theseventhtable/reservation-v--lisbon-alfresco?ref=release',release:'2026-07-17',available:true},
  {n:'VI',title:'Kyoto Garden',city:'Kyoto',country:'Japan',lat:35.0116,lon:135.7681,copy:'Peaceful elegance inspired by Japanese gardens, silence and timeless beauty.',url:'https://distrokid.com/hyperfollow/theseventhtable/reservation-vi--kyoto-garden?ref=release',release:'2026-07-18',available:false},
  {n:'VII',title:'Bosphorus Nights',city:'Istanbul',country:'Türkiye',lat:41.0082,lon:28.9784,copy:'Where Europe and Asia meet beneath shimmering lights and endless conversations.',url:'https://distrokid.com/hyperfollow/theseventhtable/reservation-vii---bosphorus-nights?ref=release',release:'2026-07-19',available:false},
  {n:'VIII',title:'Marrakech Courtyard',city:'Marrakech',country:'Morocco',lat:31.6295,lon:-7.9811,copy:'Golden lanterns, aromatic spices and the hypnotic atmosphere of a Moroccan evening.',url:'https://distrokid.com/hyperfollow/theseventhtable/reservation-viii--marrakech-courtyard?ref=release',release:'2026-07-20',available:false},
  {n:'IX',title:'Sarajevo Courtyard',city:'Sarajevo',country:'Bosnia and Herzegovina',lat:43.8563,lon:18.4131,copy:'An intimate courtyard where East meets West, filled with history, conversation and quiet emotion.',url:'https://distrokid.com/hyperfollow/theseventhtable/reservation-ix--sarajevo-courtyard?ref=release',release:'2026-07-21',available:false},
  {n:'X',title:'Buenos Aires Evening',city:'Buenos Aires',country:'Argentina',lat:-34.6037,lon:-58.3816,copy:'Warm rhythms, candlelight and the timeless elegance of an unforgettable Argentine evening.',url:'https://distrokid.com/hyperfollow/theseventhtable/reservation-x--buenos-aires-evening',release:'2026-07-22',available:false}
];



const releaseMoment = (r) => new Date(`${r.release}T00:00:00+02:00`).getTime();
const now = Date.now();
reservations.forEach((r) => { r.available = releaseMoment(r) <= now; r.next = false; });
const latestReservation = [...reservations].filter(r => r.available).sort((a,b) => releaseMoment(b)-releaseMoment(a))[0] || reservations[0];
const nextReservation = reservations.find(r => !r.available) || null;
if (nextReservation) nextReservation.next = true;

const latestNumber = document.getElementById('latestReleaseNumber');
const latestTitle = document.getElementById('latestReleaseTitle');
const latestCopy = document.getElementById('latestReleaseCopy');
const latestPlace = document.getElementById('latestReleasePlace');
const latestLink = document.getElementById('latestReleaseLink');
const latestWatermark = document.getElementById('latestReleaseWatermark');
if (latestReservation) {
  if (latestNumber) latestNumber.textContent = `Reservation ${latestReservation.n}`;
  if (latestTitle) latestTitle.textContent = latestReservation.title;
  if (latestCopy) latestCopy.textContent = latestReservation.copy;
  if (latestPlace) latestPlace.textContent = `${latestReservation.city} · ${latestReservation.country}`;
  if (latestLink) latestLink.href = latestReservation.url;
  if (latestWatermark) latestWatermark.textContent = latestReservation.n;
}

const liveCount = reservations.filter(r => r.available).length;
const liveCountNode = document.getElementById('collectionLiveCount');
const progressText = document.getElementById('collectionProgressText');
const collectionTrack = document.getElementById('collectionTrack');
if (liveCountNode) liveCountNode.textContent = String(liveCount);
if (progressText) progressText.textContent = nextReservation
  ? `The journey continues with Reservation ${nextReservation.n} — ${nextReservation.title}.`
  : 'The complete first collection is now being served.';
if (collectionTrack) {
  collectionTrack.innerHTML = reservations.map(r => `<div class="collection-step${r.available ? ' is-live' : ''}${r.next ? ' is-next' : ''}"><span>${r.n}</span><small>${r.available ? 'Live' : 'Soon'}</small></div>`).join('');
}

const nextService = document.getElementById('next-service');
const countdownDateNode = document.getElementById('countdownDate');
if (nextService && nextReservation) {
  nextService.dataset.release = `${nextReservation.release}T00:00:00+02:00`;
  if (countdownDateNode) countdownDateNode.textContent = `Coming Soon · Reservation ${nextReservation.n} — ${nextReservation.title}`;
} else if (nextService && !nextReservation) {
  nextService.dataset.release = '';
}

const list = document.getElementById('reservationList');
const reservationLocale = {
  en: {available:'Available Now', coming:'Coming Soon', next:'Next Reservation', released:'Released', releases:'Releases', listen:'Listen Now'},
  de: {available:'Jetzt verfügbar', coming:'Demnächst', next:'Nächste Reservation', released:'Veröffentlicht', releases:'Erscheint', listen:'Jetzt anhören'},
  fr: {available:'Disponible', coming:'Bientôt', next:'Prochaine Réservation', released:'Sorti le', releases:'Sortie le', listen:'Écouter'},
  es: {available:'Disponible', coming:'Próximamente', next:'Próxima Reserva', released:'Publicado', releases:'Disponible el', listen:'Escuchar ahora'}
};
const dateLocales = {en:'en-GB',de:'de-DE',fr:'fr-FR',es:'es-ES'};
const renderReservations = () => {
  if (!list) return;
  const lang = window.TST_I18N?.getLanguage?.() || document.documentElement.lang || 'en';
  const copy = reservationLocale[lang] || reservationLocale.en;
  const dateLocale = dateLocales[lang] || dateLocales.en;
  list.innerHTML = '';
  reservations.forEach((r) => {
    const date = new Intl.DateTimeFormat(dateLocale,{day:'numeric',month:'long',year:'numeric',timeZone:'Europe/Berlin'}).format(new Date(`${r.release}T12:00:00+02:00`));
    const el = document.createElement('article');
    el.className = `reservation-item ${r.available ? 'is-available' : 'is-upcoming'}${r.next ? ' is-next' : ''}`;
    const status = r.available ? copy.available : copy.coming;
    const dateLabel = r.available ? copy.released : copy.releases;
    const nextBadge = r.next ? `<span class="reservation-next">${copy.next}</span>` : '';
    const action = r.available
      ? `<a class="reservation-action" target="_blank" rel="noopener noreferrer" href="${r.url}">${copy.listen} →</a>`
      : `<span class="reservation-action is-disabled" aria-disabled="true">${copy.coming}</span>`;
    el.innerHTML = `<div class="num">Reservation ${r.n}</div><div class="reservation-copy">${nextBadge}<span class="reservation-status">${status}</span><h3>${r.title}</h3><p>${r.copy}</p><span class="reservation-meta">${r.city} · ${r.country}</span><span class="reservation-date">${dateLabel} · ${date}</span></div>${action}`;
    list.appendChild(el);
  });
};
renderReservations();
window.addEventListener('tst:languagechange', renderReservations);

const destinationStrip = document.getElementById('destinationStrip');
const markerLayer = document.getElementById('globeMarkerLayer');
const markerElements = [];
const routeLayer = document.getElementById('globeRouteLayer');
const routePath = document.getElementById('globeRoutePath');
const infoCard = document.getElementById('globeInfoCard');
const infoNumber = document.getElementById('globeInfoNumber');
const infoTitle = document.getElementById('globeInfoTitle');
const infoPlace = document.getElementById('globeInfoPlace');
const infoCopy = document.getElementById('globeInfoCopy');
let activeReservation = reservations.find(r => r.n === 'VII') || reservations[0];
let requestedFocus = null;
let pendingOpen = null;

reservations.forEach((r) => {
  if (destinationStrip) {
    const chip = document.createElement('a');
    chip.className = 'destination-chip';
    chip.href = r.url;
    chip.target = '_blank';
    chip.rel = 'noopener noreferrer';
    chip.dataset.reservation = r.n;
    chip.innerHTML = `<span class="roman">RESERVATION ${r.n}</span><strong>${r.title}</strong><small>${r.city} · ${r.country}</small>`;
    destinationStrip.appendChild(chip);
  }

  if (markerLayer) {
    const marker = document.createElement('a');
    marker.className = 'globe3d-marker';
    marker.href = r.url;
    marker.target = '_blank';
    marker.rel = 'noopener noreferrer';
    marker.dataset.reservation = r.n;
    marker.setAttribute('aria-label', `${r.title}, ${r.city} — open HyperFollow`);
    marker.innerHTML = `<span class="globe3d-dot"></span><span class="globe3d-label"><b>Reservation ${r.n}</b><strong>${r.title}</strong><small>${r.city} · ${r.country}</small></span>`;
    markerLayer.appendChild(marker);
    markerElements.push({data:r, element:marker});
  }
});

const updateInfoCard = (r) => {
  if (!r) return;
  activeReservation = r;
  if (infoNumber) infoNumber.textContent = `Reservation ${r.n}`;
  if (infoTitle) infoTitle.textContent = r.title;
  if (infoPlace) infoPlace.textContent = `${r.city} · ${r.country}`;
  if (infoCopy) infoCopy.textContent = r.copy;
  infoCard?.classList.add('is-active');
};

const focusReservation = (r, openAfter = false) => {
  updateInfoCard(r);
  requestedFocus = r;
  if (openAfter) pendingOpen = {url:r.url, started:performance.now()};
};

const syncDestinationFocus = () => {
  const chips = [...document.querySelectorAll('.destination-chip')];
  markerElements.forEach(({data,element}) => {
    const chip = chips.find(c => c.dataset.reservation === data.n);
    if (!chip) return;
    const on = () => {
      element.classList.add('is-active');
      chip.classList.add('is-active');
      focusReservation(data,false);
    };
    const off = () => {
      element.classList.remove('is-active');
      chip.classList.remove('is-active');
    };
    [element,chip].forEach(node => {
      node.addEventListener('mouseenter', on);
      node.addEventListener('mouseleave', off);
      node.addEventListener('focus', on);
      node.addEventListener('blur', off);
      node.addEventListener('click', (ev) => {
        ev.preventDefault();
        focusReservation(data,true);
      });
    });
  });
};
syncDestinationFocus();
updateInfoCard(activeReservation);

const revealItems = document.querySelectorAll('.section-reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, {threshold: 0.12});
  revealItems.forEach((el) => io.observe(el));
} else {
  revealItems.forEach((el) => el.classList.add('visible'));
}

const welcome = document.getElementById('welcome');
const enter = document.getElementById('enterSite');
if (welcome && enter) {
  if (sessionStorage.getItem('tst-entered') === 'yes') {
    welcome.classList.add('hide');
    welcome.setAttribute('aria-hidden', 'true');
  }
  enter.addEventListener('click', () => {
    sessionStorage.setItem('tst-entered', 'yes');
    welcome.classList.add('hide');
    welcome.setAttribute('aria-hidden', 'true');
  });
}

const header = document.querySelector('.site-header');
const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 24);
onScroll();
window.addEventListener('scroll', onScroll, {passive:true});

const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
if (menuToggle && mainNav) {
  const closeMenu = () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    mainNav.classList.remove('open');
    document.body.classList.remove('menu-open');
  };
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!open));
    menuToggle.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
    mainNav.classList.toggle('open', !open);
    document.body.classList.toggle('menu-open', !open);
  });
  mainNav.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
}

const sectionLinks = [...document.querySelectorAll('nav a[href^="#"]')];
const sections = sectionLinks.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
if ('IntersectionObserver' in window && sections.length) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
    });
  }, {rootMargin:'-35% 0px -55% 0px'});
  sections.forEach((section) => navObserver.observe(section));
}

// V8 — self-contained WebGL Earth. No external JavaScript library.
(() => {
  const canvas = document.getElementById('earthCanvas');
  const shell = document.getElementById('earth3dShell');
  const stage = document.getElementById('earth3dStage');
  const fallback = document.getElementById('earthFallback');
  if (!canvas || !stage || !shell) return;

  const gl = canvas.getContext('webgl', {
    alpha:true,
    antialias:true,
    powerPreference:'high-performance',
    premultipliedAlpha:false
  });

  if (!gl) {
    shell.classList.add('no-webgl');
    return;
  }

  const vertexSource = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute vec2 aUV;
    uniform mat4 uMVP;
    uniform mat3 uRotation;
    varying vec3 vNormal;
    varying vec2 vUV;
    varying vec3 vPosition;
    void main() {
      vec3 p = uRotation * aPosition;
      vPosition = p;
      vNormal = normalize(uRotation * aNormal);
      vUV = aUV;
      gl_Position = uMVP * vec4(aPosition, 1.0);
    }
  `;

  const fragmentSource = `
    precision highp float;
    uniform sampler2D uTexture;
    uniform vec3 uLightDir;
    uniform float uTime;
    varying vec3 vNormal;
    varying vec2 vUV;
    varying vec3 vPosition;

    float hash(vec2 p){
      return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123);
    }
    float noise(vec2 p){
      vec2 i=floor(p), f=fract(p);
      f=f*f*(3.0-2.0*f);
      return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),f.x),
                 mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),f.x),f.y);
    }
    float fbm(vec2 p){
      float v=0.0;
      float a=.52;
      for(int i=0;i<5;i++){
        v+=a*noise(p);
        p*=2.03;
        a*=.48;
      }
      return v;
    }

    void main() {
      vec3 tex = texture2D(uTexture, vUV).rgb;
      vec3 N = normalize(vNormal);
      vec3 L = normalize(uLightDir);
      float light = dot(N,L);
      float day = smoothstep(-0.10,0.26,light);

      float brightness=max(max(tex.r,tex.g),tex.b);
      float landMask=smoothstep(0.035,0.14,brightness);
      float cityMask=smoothstep(0.30,0.86,brightness);
      float oceanMask=1.0-landMask;

      vec3 ocean=vec3(0.015,0.072,0.14);
      vec3 land=vec3(0.18,0.23,0.16);
      vec3 daylight=mix(ocean,land,landMask);
      daylight*=0.38+max(light,0.0)*1.18;

      vec3 V=normalize(vec3(0.0,0.0,3.2)-vPosition);
      vec3 H=normalize(L+V);
      float spec=pow(max(dot(N,H),0.0),60.0)*oceanMask*day;
      daylight+=vec3(0.55,0.70,0.90)*spec*0.95;

      vec3 night=tex*vec3(1.42,1.12,0.72)*2.35;
      night*=1.0-day*0.88;
      night+=vec3(0.018,0.026,0.055)*(1.0-day)*oceanMask;

      vec2 cloudUV=vUV*vec2(4.5,2.2)+vec2(uTime*0.0025,0.0);
      float clouds=fbm(cloudUV);
      clouds=smoothstep(0.58,0.78,clouds);
      float cloudLight=max(light,0.0);
      vec3 cloudColor=vec3(0.85,0.88,0.92)*(0.22+cloudLight*0.95);
      vec3 color=daylight*day+night;
      color=mix(color,cloudColor,clouds*(0.10+0.24*day));

      float rim=pow(1.0-max(dot(N,V),0.0),3.2);
      color+=vec3(0.08,0.30,0.55)*rim*(0.18+day*0.75);

      float terminator=1.0-smoothstep(0.0,0.18,abs(light));
      color+=vec3(0.40,0.24,0.08)*terminator*0.12;

      float nightBloom=cityMask*(1.0-day);
      color+=vec3(0.28,0.18,0.06)*nightBloom*0.18;

      gl_FragColor=vec4(color,1.0);
    }
  `;

  const compile = (type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const program = gl.createProgram();
  const vs = compile(gl.VERTEX_SHADER, vertexSource);
  const fs = compile(gl.FRAGMENT_SHADER, fragmentSource);
  if (!vs || !fs) {
    shell.classList.add('no-webgl');
    return;
  }
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    shell.classList.add('no-webgl');
    return;
  }
  gl.useProgram(program);

  const latSegments = 80;
  const lonSegments = 160;
  const positions = [];
  const normals = [];
  const uvs = [];
  const indices = [];

  for (let y = 0; y <= latSegments; y++) {
    const v = y / latSegments;
    const lat = (0.5 - v) * Math.PI;
    const cosLat = Math.cos(lat);
    const sinLat = Math.sin(lat);
    for (let x = 0; x <= lonSegments; x++) {
      const u = x / lonSegments;
      const lon = (u - 0.5) * Math.PI * 2.0;
      const px = cosLat * Math.sin(lon);
      const py = sinLat;
      const pz = cosLat * Math.cos(lon);
      positions.push(px, py, pz);
      normals.push(px, py, pz);
      uvs.push(u, v);
    }
  }
  for (let y = 0; y < latSegments; y++) {
    for (let x = 0; x < lonSegments; x++) {
      const a = y * (lonSegments + 1) + x;
      const b = a + lonSegments + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }

  const makeBuffer = (data, location, size) => {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
    return buffer;
  };

  makeBuffer(positions, gl.getAttribLocation(program, 'aPosition'), 3);
  makeBuffer(normals, gl.getAttribLocation(program, 'aNormal'), 3);
  makeBuffer(uvs, gl.getAttribLocation(program, 'aUV'), 2);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  const uMVP = gl.getUniformLocation(program, 'uMVP');
  const uRotation = gl.getUniformLocation(program, 'uRotation');
  const uLightDir = gl.getUniformLocation(program, 'uLightDir');
  const uTime = gl.getUniformLocation(program, 'uTime');
  const uTexture = gl.getUniformLocation(program, 'uTexture');

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([8,11,22,255]));
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  shell.classList.add('webgl-ready');
  fallback?.setAttribute('aria-hidden','true');

  const textureImage = new Image();
  textureImage.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, textureImage);
    shell.classList.add('texture-ready');
  };
  textureImage.onerror = () => shell.classList.add('no-webgl');
  textureImage.src = 'assets/earth-night-3d.jpg';

  const perspective = (fov, aspect, near, far) => {
    const f = 1 / Math.tan(fov / 2);
    const nf = 1 / (near - far);
    return new Float32Array([
      f/aspect,0,0,0,
      0,f,0,0,
      0,0,(far+near)*nf,-1,
      0,0,(2*far*near)*nf,0
    ]);
  };
  const multiply4 = (a,b) => {
    const out = new Float32Array(16);
    for (let c=0;c<4;c++) for (let r=0;r<4;r++) {
      out[c*4+r] = a[0*4+r]*b[c*4+0]+a[1*4+r]*b[c*4+1]+a[2*4+r]*b[c*4+2]+a[3*4+r]*b[c*4+3];
    }
    return out;
  };
  const rotationMatrix = (rx,ry) => {
    const cx=Math.cos(rx), sx=Math.sin(rx), cy=Math.cos(ry), sy=Math.sin(ry);
    return new Float32Array([
      cy, sx*sy, -cx*sy,
      0, cx, sx,
      sy, -sx*cy, cx*cy
    ]);
  };
  const model4FromRotation = (r) => new Float32Array([
    r[0],r[1],r[2],0,
    r[3],r[4],r[5],0,
    r[6],r[7],r[8],0,
    0,0,0,1
  ]);
  const view = new Float32Array([
    1,0,0,0,
    0,1,0,0,
    0,0,1,0,
    0,0,-3.05,1
  ]);

  let yaw = -0.12;
  let pitch = -0.17;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let pointerInside = false;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const onPointerDown = (e) => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    canvas.setPointerCapture?.(e.pointerId);
    shell.classList.add('is-dragging');
  };
  const onPointerMove = (e) => {
    pointerInside = true;
    if (!dragging) return;
    yaw += (e.clientX - lastX) * 0.005;
    pitch += (e.clientY - lastY) * 0.004;
    pitch = Math.max(-0.72, Math.min(0.72, pitch));
    lastX = e.clientX;
    lastY = e.clientY;
  };
  const onPointerUp = (e) => {
    dragging = false;
    canvas.releasePointerCapture?.(e.pointerId);
    shell.classList.remove('is-dragging');
  };

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerUp);
  canvas.addEventListener('pointerenter', () => pointerInside = true);
  canvas.addEventListener('pointerleave', () => pointerInside = false);

  const resize = () => {
    const rect = stage.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const width = Math.max(1, Math.floor(rect.width * dpr));
    const height = Math.max(1, Math.floor(rect.height * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      gl.viewport(0,0,width,height);
    }
    return {width:rect.width,height:rect.height,aspect:rect.width/rect.height};
  };

  const transformPoint = (lat,lon,rot) => {
    const phi = lat * Math.PI/180;
    const theta = lon * Math.PI/180;
    const x = Math.cos(phi) * Math.sin(theta);
    const y = Math.sin(phi);
    const z = Math.cos(phi) * Math.cos(theta);
    return {
      x:rot[0]*x+rot[3]*y+rot[6]*z,
      y:rot[1]*x+rot[4]*y+rot[7]*z,
      z:rot[2]*x+rot[5]*y+rot[8]*z
    };
  };

  const normalizeAngle = (a) => {
    while (a > Math.PI) a -= Math.PI * 2;
    while (a < -Math.PI) a += Math.PI * 2;
    return a;
  };
  const destinationAngles = (r) => ({
    yaw: normalizeAngle(-(r.lon * Math.PI/180)),
    pitch: Math.max(-0.62, Math.min(0.62, r.lat * Math.PI/180 * 0.62))
  });
  const easeAngle = (current,target,amount) => {
    const delta = normalizeAngle(target-current);
    return current + delta * amount;
  };
  const screenPointFor = (lat,lon,rot,size,scale) => {
    const p = transformPoint(lat,lon,rot);
    const cameraZ = 3.05-p.z;
    return {
      x:size.width/2+(p.x/cameraZ)*scale,
      y:size.height/2-(p.y/cameraZ)*scale,
      z:p.z
    };
  };
  const updateRoute = (from,to,rot,size,scale) => {
    if (!routePath || !from || !to) return;
    const a = screenPointFor(from.lat,from.lon,rot,size,scale);
    const b = screenPointFor(to.lat,to.lon,rot,size,scale);
    if (a.z < -0.02 || b.z < -0.02) {
      routePath.style.opacity='0';
      return;
    }
    const mx=(a.x+b.x)/2;
    const my=Math.min(a.y,b.y)-Math.max(65,Math.abs(a.x-b.x)*0.18);
    routePath.setAttribute('d',`M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`);
    routePath.style.opacity='1';
  };

  let lastTime = performance.now();
  const render = (time) => {
    const dt = Math.min(50, time-lastTime);
    lastTime = time;
    if (requestedFocus && !dragging) {
      const target = destinationAngles(requestedFocus);
      yaw = easeAngle(yaw,target.yaw,Math.min(0.08,dt*0.0018));
      pitch += (target.pitch-pitch)*Math.min(0.08,dt*0.0018);
      const yawError=Math.abs(normalizeAngle(target.yaw-yaw));
      const pitchError=Math.abs(target.pitch-pitch);
      if (pendingOpen && yawError<0.035 && pitchError<0.035 && performance.now()-pendingOpen.started>450) {
        const url=pendingOpen.url;
        pendingOpen=null;
        requestedFocus=null;
        window.open(url,'_blank','noopener,noreferrer');
      }
    } else if (!dragging && !reducedMotion) {
      yaw += dt * (pointerInside ? 0.000008 : 0.000018);
    }

    const size = resize();
    const rot = rotationMatrix(pitch,yaw);
    const model = model4FromRotation(rot);
    const proj = perspective(38*Math.PI/180,size.aspect,0.1,20);
    const mvp = multiply4(proj,multiply4(view,model));

    gl.clearColor(0,0,0,0);
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.useProgram(program);
    gl.uniformMatrix4fv(uMVP,false,mvp);
    gl.uniformMatrix3fv(uRotation,false,rot);
    gl.uniform3f(uLightDir,-0.72,0.22,0.66);
    gl.uniform1f(uTime,time*0.001);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D,texture);
    gl.uniform1i(uTexture,0);
    gl.drawElements(gl.TRIANGLES,indices.length,gl.UNSIGNED_SHORT,0);

    const scale = (size.height * 0.5) / Math.tan(38*Math.PI/360);
    markerElements.forEach(({data,element}) => {
      const p = transformPoint(data.lat,data.lon,rot);
      const cameraZ = 3.05 - p.z;
      const visible = p.z > -0.02;
      const sx = size.width/2 + (p.x/cameraZ)*scale;
      const sy = size.height/2 - (p.y/cameraZ)*scale;
      element.style.transform = `translate3d(${sx}px,${sy}px,0) translate(-50%,-50%) scale(${visible ? 1 : .72})`;
      element.style.opacity = visible ? '1' : '0';
      element.style.pointerEvents = visible ? 'auto' : 'none';
      element.style.zIndex = String(1000 + Math.round(p.z*100));
    });

    const routeOrigin = reservations.find(r => r.n === 'I') || reservations[0];
    if (activeReservation && activeReservation.n !== routeOrigin.n) {
      updateRoute(routeOrigin,activeReservation,rot,size,scale);
    } else if (routePath) {
      routePath.style.opacity='0';
    }

    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);
})();

// V16 — form submission is handled centrally by forms-direct.js.
// This file retains all visual and interaction logic only.

// V11 — Next-service countdown and refined page transitions.
(() => {
  const section = document.getElementById('next-service');
  const countdown = document.getElementById('countdown');
  if (section && countdown) {
    const release = new Date(section.dataset.release || '');
    const days = document.getElementById('countDays');
    const hours = document.getElementById('countHours');
    const minutes = document.getElementById('countMinutes');
    const seconds = document.getElementById('countSeconds');
    const headline = document.getElementById('countdownHeadline');
    const dateLine = document.getElementById('countdownDate');
    const pad = (value) => String(Math.max(0, value)).padStart(2, '0');

    const tick = () => {
      const remaining = release.getTime() - Date.now();
      if (!Number.isFinite(remaining) || remaining <= 0) {
        countdown.classList.add('is-live');
        countdown.innerHTML = '<div><strong>Now serving</strong><span>The journey has begun</span></div>';
        if (headline) headline.textContent = 'Your table is ready.';
        if (dateLine) dateLine.textContent = 'Reservations I–X are now being served.';
        return false;
      }
      const totalSeconds = Math.floor(remaining / 1000);
      if (days) days.textContent = pad(Math.floor(totalSeconds / 86400));
      if (hours) hours.textContent = pad(Math.floor((totalSeconds % 86400) / 3600));
      if (minutes) minutes.textContent = pad(Math.floor((totalSeconds % 3600) / 60));
      if (seconds) seconds.textContent = pad(totalSeconds % 60);
      return true;
    };
    if (tick()) setInterval(tick, 1000);
  }

  const curtain = document.getElementById('pageCurtain');
  if (!curtain || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank') return;
    let target;
    try { target = new URL(link.href, window.location.href); } catch { return; }
    if (target.origin !== window.location.origin) return;
    link.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      curtain.classList.add('is-leaving');
      setTimeout(() => { window.location.href = target.href; }, 520);
    });
  });
  window.addEventListener('pageshow', () => curtain.classList.remove('is-leaving'));
})();

// V13 Social Launch Edition — native sharing and tracked campaign links.
(() => {
  const pageUrl = 'https://the-seventh-table.com/?utm_source=social&utm_medium=share&utm_campaign=the_seventh_table';
  const shareText = 'The Seventh Table — Luxury Dining Soundtracks. Every Reservation is a destination.';
  const status = document.getElementById('shareStatus');
  const setStatus = (message) => {
    if (!status) return;
    status.textContent = message;
    window.clearTimeout(setStatus.timer);
    setStatus.timer = window.setTimeout(() => { status.textContent = ''; }, 3500);
  };

  const links = {
    x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pageUrl + '&utm_content=x')}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl + '&utm_content=facebook')}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl + '&utm_content=linkedin')}`
  };

  document.querySelectorAll('[data-share]').forEach((link) => {
    const network = link.dataset.share;
    if (links[network]) link.href = links[network];
  });

  document.querySelector('[data-share-native]')?.addEventListener('click', async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'The Seventh Table', text: shareText, url: pageUrl });
        setStatus('Invitation shared.');
      } catch (error) {
        if (error?.name !== 'AbortError') setStatus('Sharing was not completed.');
      }
    } else {
      await navigator.clipboard.writeText(pageUrl);
      setStatus('Invitation link copied.');
    }
  });

  document.querySelector('[data-copy-link]')?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setStatus('Invitation link copied.');
    } catch {
      setStatus('Please copy the address from your browser.');
    }
  });
})();
