(() => {
  const hash = window.location.hash || '';
  const isIdentityCallback = /#(?:invite_token|confirmation_token|recovery_token|email_change_token)=/i.test(hash);
  if (isIdentityCallback) {
    window.location.replace(`/signature-circle.html${hash}`);
  }
})();
