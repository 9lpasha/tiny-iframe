export const compareEditorVersions = (fromSaas, fromIframe) => {
  let n = 0;

  for (let i = 0; i < fromSaas.length; i++) {
    if (fromSaas[i] !== fromIframe[i + n]) {
      n += 1;
    }
  }

  if (fromSaas.length === 0 && fromIframe.length >= 2) {
    return false;
  }

  return n <= 2;
};
