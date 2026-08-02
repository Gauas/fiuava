/**
 * Fiuava form receiver — bind this script to the target Google Sheet.
 * Deploy as Web app, execute as yourself, access: Anyone.
 */
const FORM_CONFIG = Object.freeze({
  survey: {
    sheetName: 'Khao sat',
    headers: ['Thời gian máy chủ', 'Thời gian trình duyệt', 'Nhóm tuổi', 'Quan tâm chất xơ', 'Phiên bản ưu tiên', 'Mức hương ổi', 'Mong chờ', 'Trang gửi', 'Thiết bị'],
    fields: ['age', 'fiber', 'type', 'taste', 'message'],
    required: ['age', 'fiber', 'type', 'taste'],
  },
  contact: {
    sheetName: 'Lien he',
    headers: ['Thời gian máy chủ', 'Thời gian trình duyệt', 'Họ và tên', 'Số điện thoại', 'Email', 'Nội dung', 'Trang gửi', 'Thiết bị'],
    fields: ['name', 'phone', 'email', 'message'],
    required: ['name', 'phone', 'email', 'message'],
  },
});

function doGet() {
  return jsonOutput_({ ok: true, service: 'fiuava-form-receiver' });
}

function doPost(event) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const payload = parsePayload_(event);
    verifyToken_(payload.token);

    // Honeypot: bot điền trường ẩn thì trả thành công nhưng không ghi dữ liệu.
    if (payload.values && payload.values.website) {
      return jsonOutput_({ ok: true });
    }

    const config = FORM_CONFIG[payload.formType];
    if (!config) throw new Error('INVALID_FORM_TYPE');
    validateRequired_(payload.values, config.required);

    const sheet = getOrCreateSheet_(config);
    const row = [
      new Date(),
      safeCell_(payload.submittedAt),
      ...config.fields.map((field) => safeCell_(payload.values[field])),
      safeCell_(payload.pageUrl),
      safeCell_(payload.userAgent),
    ];
    sheet.appendRow(row);
    return jsonOutput_({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonOutput_({ ok: false, error: String(error.message || error) });
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

function parsePayload_(event) {
  if (!event || !event.postData || !event.postData.contents) throw new Error('EMPTY_REQUEST');
  const payload = JSON.parse(event.postData.contents);
  if (!payload || typeof payload !== 'object' || !payload.values) throw new Error('INVALID_PAYLOAD');
  return payload;
}

function verifyToken_(receivedToken) {
  const expectedToken = PropertiesService.getScriptProperties().getProperty('FIUAVA_FORM_TOKEN');
  if (expectedToken && receivedToken !== expectedToken) throw new Error('INVALID_TOKEN');
}

function validateRequired_(values, fields) {
  fields.forEach(function (field) {
    if (!String(values[field] || '').trim()) throw new Error('MISSING_' + field.toUpperCase());
  });
}

function getOrCreateSheet_(config) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) throw new Error('SCRIPT_NOT_BOUND_TO_SHEET');
  let sheet = spreadsheet.getSheetByName(config.sheetName);
  if (!sheet) sheet = spreadsheet.insertSheet(config.sheetName);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(config.headers);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, config.headers.length).setFontWeight('bold');
  }
  return sheet;
}

function safeCell_(value) {
  const text = String(value == null ? '' : value).trim().slice(0, 5000);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function jsonOutput_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

