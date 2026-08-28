import { acceptInvite, getUser, handleAuthCallback, login, logout } from '@netlify/identity';

const byId = (id) => document.getElementById(id);
const openButton = byId('signatureAccessOpen');
const panel = byId('signatureAccessPanel');
const status = byId('signatureAccessStatus');
const loginForm = byId('signatureLoginForm');
const inviteForm = byId('signatureInviteForm');
const memberPanel = byId('signatureMemberPanel');
let inviteToken = '';
let currentTrackIndex = -1;

const arrivalTracks = [
  'First Glass at Sunset',
  'Canapés by the Sea',
  'A Quiet Toast',
  'Salt in the Evening Air',
  'Linen in the Sea Breeze',
  'The Terrace Awakens',
  'Citrus on the Breeze',
  'Golden Hour on the Terrace',
  'Conversations in Amber',
  'Sunlight Between the Glasses',
  'When the Villa Turns Gold',
  'The Last Light Before Dinner',
].map((title, index) => ({
  title,
  number: String(index + 1).padStart(2, '0'),
  chapter: 'CHAPTER I',
  chapterTitle: 'Arrival & Sunset',
  key: `signatures/filipe-silva/arrival-sunset/${String(index + 1).padStart(2, '0')} - ${title}.wav`,
}));

const dinnerTracks = [
  'Candles Before the First Course',
  'Wine Beneath the Lanterns',
  'Candlelit Algarve',
  'Olive Grove Afterglow',
  'Moonlight Between Courses',
  'Silverware in Moonlight',
  'A Course Served Slowly',
  'Between Plates and Candlelight',
  'Under the Fig Tree Lights',
  'Leaves Above the Table',
  'Wine Poured in Silence',
  'The Sommelier’s Pause',
  'Porcelain and Rosemary',
  'Olive Oil and Candlelight',
  'Midnight at the Long Table',
  'Conversations After Midnight',
  'Stories Over the Second Bottle',
  'Laughter Beneath the Lanterns',
  'The Plates Begin to Clear',
  'Empty Plates, Full Glasses',
  'Before Dessert Is Served',
  'Dessert Waits in Candlelight',
].map((title, index) => ({
  title,
  number: String(index + 1).padStart(2, '0'),
  chapter: 'CHAPTER II',
  chapterTitle: 'Dinner',
  key: `signatures/filipe-silva/dinner/${String(index + 1).padStart(2, '0')} – ${title}.wav`,
}));

const dessertTracks = [
  'Dessert Beneath the Stars',
  'Sweetness in the Night Air',
  'Coffee After Midnight',
  'Espresso Under the Lanterns',
  'The Table Stays Awake',
  'Conversations Refuse to End',
  'Lanterns After Dessert',
  'Another Bottle by the Pool',
  'The Villa Finds Its Rhythm',
  'Barefoot by the Pool',
  'Warm Tiles at Midnight',
  'Reflections Across the Water',
  'Midnight Moves Through the Garden',
  'Dancing Between Olive Trees',
  'Golden Ripples After Midnight',
  'Gold Along the Waterline',
  'The Night Softens Again',
  'Quiet Laughter by the Pool',
  'Last Drinks on the Terrace',
  'Glasses Beneath a Quiet Sky',
  'Only a Few Lights Remain',
  'The Terrace Falls Silent',
  'Until the Villa Sleeps',
  'The Last Light Goes Out',
].map((title, index) => ({
  title,
  number: String(index + 1).padStart(2, '0'),
  chapter: 'CHAPTER III',
  chapterTitle: 'Dessert & After Dinner',
  key: `signatures/filipe-silva/dessert-after-dinner/${String(index + 1).padStart(2, '0')} – ${title}.wav`,
}));

const tracks = [...arrivalTracks, ...dinnerTracks, ...dessertTracks];

function message(text) {
  status.textContent = text;
}

function showLogin() {
  loginForm.hidden = false;
  inviteForm.hidden = true;
  memberPanel.hidden = true;
}

function showMember(user) {
  loginForm.hidden = true;
  inviteForm.hidden = true;
  memberPanel.hidden = false;
  byId('signatureMemberEmail').textContent = user.email;
  message('Your private Signature room is open.');
}

openButton.addEventListener('click', () => {
  panel.hidden = !panel.hidden;
});

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  message('Opening your Signature room…');
  try {
    const user = await login(byId('signatureEmail').value.trim(), byId('signaturePassword').value);
    showMember(user);
  } catch (error) {
    message(error?.message || 'Login was not successful.');
  }
});

inviteForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  message('Activating your invitation…');
  try {
    const user = await acceptInvite(inviteToken, byId('signatureInvitePassword').value);
    history.replaceState(null, '', location.pathname + location.search);
    showMember(user);
  } catch (error) {
    message(error?.message || 'The invitation could not be activated.');
  }
});

byId('signatureLogout').addEventListener('click', async () => {
  await logout();
  byId('signatureAudio').removeAttribute('src');
  showLogin();
  message('Signed out.');
});

async function playTrack(index) {
  const track = tracks[index];
  if (!track) return;
  message(`Preparing ${track.title}…`);
  try {
    const response = await fetch('/.netlify/functions/signature-stream', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ key: track.key }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Track unavailable');
    const audio = byId('signatureAudio');
    audio.src = result.url;
    await audio.play();
    currentTrackIndex = index;
    document.querySelectorAll('.signature-track').forEach((button, buttonIndex) => {
      button.classList.toggle('is-playing', buttonIndex === index);
      button.setAttribute('aria-pressed', buttonIndex === index ? 'true' : 'false');
    });
    message(`Now playing: ${track.title}`);
  } catch (error) {
    message(error?.message || 'The track could not be played.');
  }
}

const tracklist = byId('signatureTracklist');
[
  { label: 'CHAPTER I', title: 'Arrival & Sunset', copy: '12 compositions · approximately 37 minutes', tracks: arrivalTracks },
  { label: 'CHAPTER II', title: 'Dinner', copy: '22 compositions · approximately 60 minutes', tracks: dinnerTracks },
  { label: 'CHAPTER III', title: 'Dessert & After Dinner', copy: '24 compositions · approximately 63 minutes', tracks: dessertTracks },
].forEach((chapter) => {
  const section = document.createElement('section');
  section.className = 'signature-player-chapter';
  section.innerHTML = `<header><small>${chapter.label}</small><h4>${chapter.title}</h4><p>${chapter.copy}</p></header>`;
  const list = document.createElement('ol');
  list.className = 'signature-tracklist';
  list.setAttribute('aria-label', `${chapter.title} tracklist`);
  chapter.tracks.forEach((track) => {
    const index = tracks.indexOf(track);
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'signature-track';
    button.setAttribute('aria-pressed', 'false');
    button.innerHTML = `<span>${track.number}</span><strong>${track.title}</strong><em>Play</em>`;
    button.addEventListener('click', () => playTrack(index));
    item.append(button);
    list.append(item);
  });
  section.append(list);
  tracklist.append(section);
});

byId('signatureAudio').addEventListener('ended', () => {
  if (currentTrackIndex >= 0 && currentTrackIndex < tracks.length - 1) {
    playTrack(currentTrackIndex + 1);
  }
});

async function start() {
  try {
    const callback = await handleAuthCallback();
    if (callback?.type === 'invite' && callback.token) {
      inviteToken = callback.token;
      panel.hidden = false;
      loginForm.hidden = true;
      inviteForm.hidden = false;
      memberPanel.hidden = true;
      message('Invitation recognised. Please choose your password.');
      return;
    }
    const user = callback?.user || await getUser();
    if (user) showMember(user);
    else showLogin();
  } catch (error) {
    panel.hidden = false;
    showLogin();
    message(error?.message || 'The private access could not be prepared.');
  }
}

start();
