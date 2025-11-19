// ONLY A PART of a full function that gets the job done.
// Shows how the texts inside class="pi" are converted on the web pages with the csv files' data.

const PI_PARAM = "pi";
const PI_CONV_BASE = "/conv/";
let currentPiFile = null;
const piCache = {};
const piTextOriginals = new WeakMap(); // TextNode -> original string

function getPiFilenameFromUrl(href) {
  try {
    const url = new URL(href, window.location.origin);
    const value = url.searchParams.get(PI_PARAM);
    if (value && value.trim() !== "") {
      return value.trim();
    }
  } catch (e) {
    console.error(e);
  }
  return null;
}

function decodeUnicodeEscapes(str) {
  return str.replace(/\\u([0-9a-fA-F]{4})/g, function (_m, hex) {
    return String.fromCharCode(parseInt(hex, 16));
  });
}

function cleanCell(cell) {
  cell = cell.trim();
  if (
    (cell.startsWith('"') && cell.endsWith('"')) ||
    (cell.startsWith("'") && cell.endsWith("'"))
  ) {
    cell = cell.slice(1, -1);
  }
  return cell;
}

function parseCsv(text) {
  const rules = [];
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line || line.startsWith("#")) continue;
    const parts = line.split(",");
    if (parts.length < 2) continue;

    let fromRaw = cleanCell(parts[0]);
    let toRaw = cleanCell(parts[1]);

    const from = decodeUnicodeEscapes(fromRaw);
    const to = decodeUnicodeEscapes(toRaw);

    if (from !== "") {
              // apply from top to bottom
      rules.push([from, to]);
    }
  }
  return rules;
}
