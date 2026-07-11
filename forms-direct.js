/**
 * V16 — Direct, reliable form delivery.
 *
 * Every website form calls the deployed Netlify Function directly.
 * The website calls the Netlify Function directly. No Netlify form
 * notification, webhook, or secondary archive submission is used.
 * This prevents duplicate “table” notification emails.
 */
(() => {
  const endpoint = '/.netlify/functions/forms-api';
  const supportedForms = new Set([
    'guest-list',
    'partner-inquiry',
    'press-inquiry',
    'licensing-inquiry',
  ]);

  const encode = (data) => new URLSearchParams(data).toString();

  const formDataToObject = (form) => {
    const object = Object.fromEntries(new FormData(form).entries());
    object.formName = object['form-name'] || form.getAttribute('name') || '';
    object['submitted-at'] = object['submitted-at'] || new Date().toISOString();
    return object;
  };

  const setState = (form, { loading = false, message = '', error = false } = {}) => {
    const button = form.querySelector('button[type="submit"]');
    let status = form.querySelector('[data-form-status], .signup-status, .inquiry-status');
    if (!status) {
      status = document.createElement('p');
      status.className = 'inquiry-status';
      status.setAttribute('data-form-status', '');
      status.setAttribute('aria-live', 'polite');
      form.appendChild(status);
    }
    if (button) {
      if (!button.dataset.originalLabel) button.dataset.originalLabel = button.textContent.trim();
      button.disabled = loading;
      button.setAttribute('aria-busy', String(loading));
      button.textContent = loading
        ? (button.dataset.loadingLabel || 'Sending…')
        : button.dataset.originalLabel;
    }
    status.textContent = message;
    status.classList.toggle('is-error', Boolean(error));
  };


  const submit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      setState(form, { message: 'Please check the required fields.', error: true });
      return;
    }

    const payload = formDataToObject(form);
    if (!supportedForms.has(payload.formName)) return;

    // Honeypot: pretend success to bots, but send nothing.
    if (String(payload['bot-field'] || '').trim()) {
      window.location.assign(form.action || '/thank-you.html');
      return;
    }

    setState(form, {
      loading: true,
      message: payload.formName === 'guest-list'
        ? 'Reserving your seat…'
        : 'Sending your request…',
    });

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) {
        throw new Error(result.message || `Request failed (${response.status})`);
      }

      window.location.assign(form.action || (payload.formName === 'guest-list' ? '/thank-you.html' : '/inquiry-received.html'));
    } catch (error) {
      console.error('[forms] Submission failed', error);
      setState(form, {
        loading: false,
        message: 'The request could not be sent. Please try again or contact us by email.',
        error: true,
      });
    }
  };

  document.querySelectorAll('form[name]').forEach((form) => {
    if (supportedForms.has(form.getAttribute('name'))) {
      form.addEventListener('submit', submit);
    }
  });
})();
