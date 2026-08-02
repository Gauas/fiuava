const GOOGLE_SCRIPT_HOSTS = new Set(['script.google.com', 'script.googleusercontent.com']);

export const getGoogleSheetsConfig = () => ({
  endpoint: String(import.meta.env.VITE_GOOGLE_SHEETS_ENDPOINT || '').trim(),
  token: String(import.meta.env.VITE_GOOGLE_SHEETS_TOKEN || '').trim(),
});

const validateEndpoint = (endpoint) => {
  if (!endpoint) {
    throw new Error('MISSING_ENDPOINT');
  }

  let url;
  try {
    url = new URL(endpoint);
  } catch {
    throw new Error('INVALID_ENDPOINT');
  }

  if (url.protocol !== 'https:' || !GOOGLE_SCRIPT_HOSTS.has(url.hostname) || !url.pathname.endsWith('/exec')) {
    throw new Error('INVALID_ENDPOINT');
  }

  return url.toString();
};

export const submitToGoogleSheets = async ({ endpoint, token, formType, values }) => {
  const target = validateEndpoint(endpoint);
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15000);

  const payload = {
    formType,
    token,
    submittedAt: new Date().toISOString(),
    pageUrl: window.location.href,
    userAgent: navigator.userAgent,
    values,
  };

  try {
    // text/plain + no-cors tránh preflight và tương thích với redirect của Apps Script.
    // Promise chỉ hoàn tất khi trình duyệt đã gửi request thành công; Apps Script tiếp tục
    // xác thực dữ liệu trước khi ghi vào Sheet.
    await fetch(target, {
      method: 'POST',
      mode: 'no-cors',
      redirect: 'follow',
      cache: 'no-store',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    return { ok: true };
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('REQUEST_TIMEOUT');
    throw new Error('NETWORK_ERROR');
  } finally {
    window.clearTimeout(timeout);
  }
};

