import { acceptInvite, getUser, handleAuthCallback, login, logout } from '@netlify/identity';

const byId = (id) => document.getElementById(id);
const openButton = byId('signatureAccessOpen');
const panel = byId('signatureAccessPanel');
const status = byId('signatureAccessStatus');
const loginForm = byId('signatureLoginForm');
const inviteForm = byId('signatureInviteForm');
const memberPanel = byId('signatureMemberPanel');
let inviteToken = '';

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

byId('signatureTestTrack').addEventListener('click', async () => {
  message('Preparing the test track…');
  try {
    const response = await fetch('/.netlify/functions/signature-stream', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ key: 'signatures/filipe-silva/arrival-sunset/01-canapes-by-the-sea.wav' }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Track unavailable');
    const audio = byId('signatureAudio');
    audio.src = result.url;
    await audio.play();
    message('Now playing: Canapés by the Sea');
  } catch (error) {
    message(error?.message || 'The test track could not be played.');
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
