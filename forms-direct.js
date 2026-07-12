/**
 * V16.2 — Direct, reliable form delivery.
 *
 * Every supported website form calls the deployed Netlify Function directly.
 * This version uses one delegated submit listener on the document,
 * so it works even if a form is loaded after this script.
 */
(() => {
  const endpoint = '/.netlify/functions/forms-api';

  const supportedForms = new Set([
    'guest-list',
    'partner-inquiry',
    'press-inquiry',
    'licensing-inquiry',
  ]);

  const formDataToObject = (form) => {
    const object = Object.fromEntries(new FormData(form).entries());
    object.formName =
      object['form-name'] ||
      form.getAttribute('name') ||
      '';
    object['submitted-at'] =
      object['submitted-at'] ||
      new Date().toISOString();
    object.language =
      object.language ||
      localStorage.getItem('tst-language') ||
      ((navigator.language || 'en').slice(0, 2));
    return object;
  };

  const setState = (
    form,
    { loading = false, message = '', error = false } = {}
  ) => {
    const button = form.querySelector('button[type="submit"]');

    let status = form.querySelector(
      '[data-form-status], .signup-status, .inquiry-status'
    );

    if (!status) {
      status = document.createElement('p');
      status.className = 'inquiry-status';
      status.setAttribute('data-form-status', '');
      status.setAttribute('aria-live', 'polite');
      form.appendChild(status);
    }

    if (button) {
      if (!button.dataset.originalLabel) {
        button.dataset.originalLabel =
          button.textContent.trim();
      }

      button.disabled = loading;
      button.setAttribute('aria-busy', String(loading));
      button.textContent = loading
        ? button.dataset.loadingLabel || 'Sending…'
        : button.dataset.originalLabel;
    }

    status.textContent = message;
    status.classList.toggle('is-error', Boolean(error));
  };

  const submit = async (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const form = target.closest('form');
    if (!(form instanceof HTMLFormElement)) return;

    const formName =
      form.querySelector('input[name="form-name"]')?.value ||
      form.getAttribute('name') ||
      '';

    if (!supportedForms.has(formName)) return;

    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      setState(form, {
        message: 'Please check the required fields.',
        error: true,
      });
      return;
    }

    const payload = formDataToObject(form);

    // Honeypot: pretend success to bots, but send nothing.
    if (String(payload['bot-field'] || '').trim()) {
      window.location.assign(
        form.action ||
          (payload.formName === 'guest-list'
            ? '/thank-you.html'
            : '/inquiry-received.html')
      );
      return;
    }

    setState(form, {
      loading: true,
      message:
        payload.formName === 'guest-list'
          ? 'Reserving your seat…'
          : 'Sending your request…',
    });

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response
        .json()
        .catch(() => ({}));

      if (!response.ok || !result.ok) {
        throw new Error(
          result.message ||
            `Request failed (${response.status})`
        );
      }

      window.location.assign(
        form.action ||
          (payload.formName === 'guest-list'
            ? '/thank-you.html'
            : '/inquiry-received.html')
      );
    } catch (error) {
      console.error('[forms] Submission failed', error);

      setState(form, {
        loading: false,
        message:
          'The request could not be sent. Please try again or contact us by email.',
        error: true,
      });
    }
  };

  document.addEventListener('submit', submit, true);
})();
