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

const tracks = [
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
  key: `signatures/filipe-silva/arrival-sunset/${String(index + 1).padStart(2, '0')} - ${title}.wav`,
}));

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
tracks.forEach((track, index) => {
  const item = document.createElement('li');
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'signature-track';
  button.setAttribute('aria-pressed', 'false');
  button.innerHTML = `<span>${track.number}</span><strong>${track.title}</strong><em>Play</em>`;
  button.addEventListener('click', () => playTrack(index));
  item.append(button);
  tracklist.append(item);
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
