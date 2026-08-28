const sharedToken = new URLSearchParams(location.search).get('access') || '';
if (sharedToken) {
  sessionStorage.setItem('tst-algarve-preview', sharedToken);
  history.replaceState(null, '', location.pathname);
}
const accessToken = sharedToken || sessionStorage.getItem('tst-algarve-preview') || '';
const status = document.getElementById('previewStatus');
const audio = document.getElementById('previewAudio');
const tracklist = document.getElementById('previewTracklist');
let currentTrackIndex = -1;

const tracks = [
  {
    number: 'I',
    chapter: 'Arrival & Sunset',
    title: 'First Glass at Sunset',
    moment: 'Arrival · warmth and anticipation',
    key: 'signatures/filipe-silva/arrival-sunset/01 - First Glass at Sunset.wav',
  },
  {
    number: 'II',
    chapter: 'Dinner',
    title: 'Midnight at the Long Table',
    moment: 'Dinner · conversation and restrained groove',
    key: 'signatures/filipe-silva/dinner/15 – Midnight at the Long Table.wav',
  },
  {
    number: 'III',
    chapter: 'Dessert & After Dinner',
    title: 'The Villa Finds Its Rhythm',
    moment: 'After dinner · renewed warmth and movement',
    key: 'signatures/filipe-silva/dessert-after-dinner/09 – The Villa Finds Its Rhythm.wav',
  },
];

function message(text) {
  status.textContent = text;
}

async function playTrack(index) {
  const track = tracks[index];
  if (!track || !accessToken) return;
  message(`Preparing ${track.title}…`);
  try {
    const response = await fetch('/.netlify/functions/signature-preview-stream', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ accessToken, key: track.key }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Preview unavailable');
    audio.src = result.url;
    await audio.play();
    currentTrackIndex = index;
    document.querySelectorAll('.signature-preview-track').forEach((button, buttonIndex) => {
      button.classList.toggle('is-playing', buttonIndex === index);
      button.setAttribute('aria-pressed', buttonIndex === index ? 'true' : 'false');
    });
    message(`Now playing: ${track.title}`);
  } catch (error) {
    message(error?.message || 'The preview could not be played.');
  }
}

tracks.forEach((track, index) => {
  const item = document.createElement('li');
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'signature-preview-track';
  button.setAttribute('aria-pressed', 'false');
  button.innerHTML = `<span>${track.number}</span><div><small>${track.chapter}</small><strong>${track.title}</strong><em>${track.moment}</em></div><b>Play</b>`;
  button.addEventListener('click', () => playTrack(index));
  item.append(button);
  tracklist.append(item);
});

audio.addEventListener('ended', () => {
  if (currentTrackIndex >= 0 && currentTrackIndex < tracks.length - 1) {
    playTrack(currentTrackIndex + 1);
  }
});

if (accessToken) {
  message('Your private preview is ready.');
} else {
  message('This private preview requires a valid invitation link.');
  document.querySelectorAll('.signature-preview-track').forEach((button) => {
    button.disabled = true;
  });
}
