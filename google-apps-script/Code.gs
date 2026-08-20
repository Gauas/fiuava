/**
 * GuavaFiber form receiver — bind this script to the target Google Sheet.
 * Deploy as Web app, execute as yourself, access: Anyone.
 */
const CONTACT_RECIPIENT = 'contact@guavafiber.website';

const FORM_CONFIG = Object.freeze({
  survey: {
    sheetName: 'Khao sat',
    headers: ['Thời gian máy chủ', 'Thời gian trình duyệt', 'Nhóm tuổi', 'Quan tâm chất xơ', 'Phiên bản ưu tiên', 'Mức hương ổi', 'Mong chờ', 'Trang gửi', 'Thiết bị', 'Hoạt động chính', 'Tần suất ăn nhẹ', 'Tần suất rau hoặc trái cây', 'Ưu tiên khi chọn', 'Độ ngọt', 'Kích thước viên', 'Thời điểm sử dụng', 'Kích thước gói', 'Thông tin bao bì', 'Mức sẵn sàng dùng thử'],
    fields: ['age', 'fiber', 'type', 'taste', 'message'],
    extraFields: ['role', 'snack_frequency', 'produce_frequency', 'priority', 'sweetness', 'texture', 'usage_time', 'pack_size', 'label_info', 'trial'],
    required: ['age', 'role', 'snack_frequency', 'produce_frequency', 'fiber', 'priority', 'type', 'taste', 'sweetness', 'texture', 'usage_time', 'pack_size', 'label_info', 'trial'],
  },
  contact: {
    sheetName: 'Lien he',
    headers: ['Thời gian máy chủ', 'Thời gian trình duyệt', 'Họ và tên', 'Số điện thoại', 'Email', 'Nội dung', 'Trang gửi', 'Thiết bị', 'Chủ đề'],
    fields: ['name', 'phone', 'email', 'message'],
    extraFields: ['topic'],
    required: ['name', 'phone', 'email', 'topic', 'message'],
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
      ...(config.extraFields || []).map((field) => safeCell_(payload.values[field])),
    ];
    sheet.appendRow(row);
    if (payload.formType === 'contact') sendContactEmail_(payload);
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
  sheet.getRange(1, 1, 1, config.headers.length).setValues([config.headers]).setFontWeight('bold');
  sheet.setFrozenRows(1);
  return sheet;
}

function safeCell_(value) {
  const text = String(value == null ? '' : value).trim().slice(0, 5000);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function sendContactEmail_(payload) {
  const values = payload.values || {};
  const email = cleanText_(values.email, 254);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('INVALID_EMAIL');

  const name = cleanText_(values.name, 160);
  const phone = cleanText_(values.phone, 80);
  const topic = cleanText_(values.topic, 120);
  const message = cleanText_(values.message, 5000);
  const subjectTopic = topic.replace(/[\r\n]+/g, ' ').trim() || 'Nội dung khác';
  const body = [
    'Bạn vừa nhận được một lời nhắn mới từ website GuavaFiber.',
    '',
    'Họ và tên: ' + name,
    'Số điện thoại: ' + phone,
    'Email: ' + email,
    'Chủ đề: ' + topic,
    '',
    'Nội dung:',
    message,
    '',
    'Thời gian gửi từ trình duyệt: ' + cleanText_(payload.submittedAt, 80),
    'Trang gửi: ' + cleanText_(payload.pageUrl, 500),
  ].join('\n');

  MailApp.sendEmail(CONTACT_RECIPIENT, '[GuavaFiber] Liên hệ mới — ' + subjectTopic, body, {
    name: 'Website GuavaFiber',
    replyTo: email,
  });
}

function cleanText_(value, maxLength) {
  return String(value == null ? '' : value).trim().slice(0, maxLength);
}

function jsonOutput_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
