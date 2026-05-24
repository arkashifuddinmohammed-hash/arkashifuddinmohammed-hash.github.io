const SHEET_ID = "11_oD5vvAYrasH3p5_aMF-VHYJW-dCmep63QyiLSQCU0";
const SHEET_NAME = "Enquiries";
const NOTIFY_EMAILS = [
  "bbcmobilesnellore@gmail.com",
  "kashifmohammad354@gmail.com"
];

const HEADERS = [
  "Created At",
  "Enquiry ID",
  "Status",
  "Service",
  "Brand",
  "Model",
  "Issue Type",
  "Issue",
  "Name",
  "Customer Phone",
  "Location",
  "Pick-up",
  "Source",
  "Page",
  "User Agent"
];

function doPost(event) {
  try {
    const payload = parsePayload_(event);
    const sheet = getOrCreateSheet_();
    const createdAt = new Date();
    const dateLabel = Utilities.formatDate(createdAt, Session.getScriptTimeZone(), "d MMMM yyyy");
    const entryRow = ensureDateSection_(sheet, dateLabel);

    sheet.getRange(entryRow, 1, 1, HEADERS.length).setValues([[
      createdAt,
      payload.enquiryId || "",
      payload.status || "WhatsApp opened",
      payload.service || "",
      payload.brand || "",
      payload.model || "",
      payload.issueType || "",
      payload.issue || "",
      payload.name || "",
      payload.customerPhone || "",
      payload.location || "",
      payload.pickup ? "Yes" : "No",
      payload.source || "",
      payload.page || "",
      payload.userAgent || ""
    ]]);
    formatSheet_(sheet);

    if (NOTIFY_EMAILS.length) {
      MailApp.sendEmail({
        to: NOTIFY_EMAILS.join(","),
        subject: "New BBC Mobile repair enquiry",
        body: [
          "New repair enquiry received.",
          "",
          `Enquiry ID: ${payload.enquiryId || ""}`,
          `Service: ${payload.service || ""}`,
          `Brand: ${payload.brand || ""}`,
          `Model: ${payload.model || ""}`,
          `Issue type: ${payload.issueType || ""}`,
          `Issue: ${payload.issue || ""}`,
          `Name: ${payload.name || ""}`,
          `Customer phone: ${payload.customerPhone || ""}`,
          `Location: ${payload.location || ""}`,
          `Pick-up: ${payload.pickup ? "Yes" : "No"}`
        ].join("\n")
      });
    }

    return json_({ ok: true });
  } catch (error) {
    return json_({ ok: false, error: error.message });
  }
}

function parsePayload_(event) {
  if (event.parameter && event.parameter.payload) {
    return JSON.parse(event.parameter.payload || "{}");
  }

  return JSON.parse((event.postData && event.postData.contents) || "{}");
}

function doGet() {
  return json_({ ok: true, message: "BBC Mobile enquiry endpoint is running" });
}

function getOrCreateSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  syncHeaders_(sheet);

  formatSheet_(sheet);

  return sheet;
}

function syncHeaders_(sheet) {
  if (sheet.getMaxColumns() < HEADERS.length) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), HEADERS.length - sheet.getMaxColumns());
  }

  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
}

function ensureDateSection_(sheet, dateLabel) {
  const lastColumn = HEADERS.length;
  const lastRow = sheet.getLastRow();

  for (let row = 2; row <= lastRow; row++) {
    if (sheet.getRange(row, 1).getValue() === dateLabel) {
      sheet.insertRowsAfter(row, 1);
      return row + 1;
    }
  }

  sheet.insertRowsBefore(2, 2);
  const dateRange = sheet.getRange(2, 1, 1, lastColumn);
  dateRange.merge();
  dateRange.setValue(dateLabel);
  return 3;
}

function formatSheet_(sheet) {
  const lastColumn = HEADERS.length;
  const lastRow = Math.max(sheet.getLastRow(), 1);
  const headerRange = sheet.getRange(1, 1, 1, lastColumn);
  const tableRange = sheet.getRange(1, 1, lastRow, lastColumn);

  sheet.setFrozenRows(1);
  if (sheet.getFilter()) {
    sheet.getFilter().remove();
  }

  headerRange
    .setBackground("#070707")
    .setFontColor("#ffffff")
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");

  tableRange
    .setBorder(true, true, true, true, true, true, "#eadcc4", SpreadsheetApp.BorderStyle.SOLID)
    .setVerticalAlignment("top")
    .setWrap(true);

  if (lastRow > 1) {
    for (let row = 2; row <= lastRow; row++) {
      const firstCell = sheet.getRange(row, 1);
      const value = firstCell.getValue();
      const rowRange = sheet.getRange(row, 1, 1, lastColumn);
      const isDateRow = typeof value === "string" && /^\d{1,2}\s[A-Za-z]+\s\d{4}$/.test(value);

      if (isDateRow) {
        rowRange
          .setBackground("#fffaf1")
          .setFontColor("#070707")
          .setFontWeight("bold")
          .setHorizontalAlignment("left");
      } else {
        rowRange
          .setBackground(row % 2 === 0 ? "#ffffff" : "#fffaf1")
          .setFontColor("#070707")
          .setFontWeight("normal")
          .setHorizontalAlignment("left");
      }
    }
  }

  sheet.setColumnWidth(1, 145);
  sheet.setColumnWidth(2, 190);
  sheet.setColumnWidth(3, 140);
  sheet.setColumnWidth(4, 170);
  sheet.setColumnWidth(5, 120);
  sheet.setColumnWidth(6, 170);
  sheet.setColumnWidth(7, 160);
  sheet.setColumnWidth(8, 260);
  sheet.setColumnWidth(9, 140);
  sheet.setColumnWidth(10, 140);
  sheet.setColumnWidth(11, 220);
  sheet.setColumnWidth(12, 90);
  sheet.setColumnWidth(13, 150);
  sheet.setColumnWidth(14, 180);
  sheet.setColumnWidth(15, 280);
}

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
