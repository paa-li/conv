// ONLY A PART of a full function that gets the job done.
// Shows how the texts inside class="pi" are converted on the web pages with the csv files' data.

function buildRule(from, to, lineNumber) {
	const fromQ = (from.match(/\?/g) || []).length;
	const toQ = (to.match(/\?/g) || []).length;

	// no question marks at all → simple literal rule
	if (fromQ === 0 && toQ === 0) {
		return {
			type: "simple",
			from: from,
			to: to
		};
	}

	// mismatch between ? counts → treat as error, skip this rule
	if (fromQ !== toQ || fromQ === 0) {
		console.warn(
			"[pi-conv] Skipping CSV rule with mismatched wildcards on line " +
				lineNumber +
				":",
			from,
			"->",
			to
		);
		return null;
	}

	// Build regex pattern: escape regex chars, then turn each "?" into a capture group.
	let groupIndex = 0;

	// Escape regex metacharacters in "from"
	let pattern = from.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");

	// Replace escaped "\?" with a single-char wildcard capture group
	pattern = pattern.replace(/\\\?/g, function () {
		groupIndex++;
		return "([\\s\\S])"; // one code unit of anything
	});

	const regex = new RegExp(pattern, "g");

	// Build replacement string: each "?" becomes $1, $2, ... in order
	let replacement = "";
	let groupCounter = 0;
	for (let i = 0; i < to.length; i++) {
		const ch = to[i];
		if (ch === "?") {
			groupCounter++;
			replacement += "$" + groupCounter;
		} else {
			// Escape "$" in replacement so it stays literal
			if (ch === "$") {
				replacement += "$$";
			} else {
				replacement += ch;
			}
		}
	}

	return {
		type: "wildcard",
		regex: regex,
		replacement: replacement
	};
}

(function () {
	"use strict";

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
				const rule = buildRule(from, to, i + 1);
				if (rule) {
					rules.push(rule);
				}
			}
		}
		return rules;
	}

	// helper: walk all TEXT nodes under an element
	function forEachTextNode(root, callback) {
		const walker = document.createTreeWalker(
			root,
			NodeFilter.SHOW_TEXT,
			null
		);
		let node;
		while ((node = walker.nextNode())) {
			const parent = node.parentNode;
			if (
				parent &&
				(parent.nodeName === "SCRIPT" || parent.nodeName === "STYLE")
			) {
				continue;
			}
			callback(node);
		}
	}

	// restore all .pi text nodes from WeakMap
	function resetPiElements() {
		const els = document.querySelectorAll(".pi");
		els.forEach(function (el) {
			forEachTextNode(el, function (textNode) {
				if (piTextOriginals.has(textNode)) {
					textNode.nodeValue = piTextOriginals.get(textNode);
				}
			});
		});
	}

	// apply rules only to TEXT nodes (not tags)
	function applyRulesToElements(rules) {
		const els = document.querySelectorAll(".pi");
		els.forEach(function (el) {
			forEachTextNode(el, function (textNode) {
				let original = piTextOriginals.get(textNode);
				if (original == null) {
					original = textNode.nodeValue;
					piTextOriginals.set(textNode, original);
				}
				let text = original;

				for (let i = 0; i < rules.length; i++) {
					const rule = rules[i];
					if (!rule) continue;

					if (rule.type === "simple") {
						if (!rule.from) continue;
						text = text.split(rule.from).join(rule.to);
					} else if (rule.type === "wildcard") {
						text = text.replace(rule.regex, rule.replacement);
					}
				}

				textNode.nodeValue = text;
			});
		});
	}
