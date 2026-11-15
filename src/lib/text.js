/**
 * Splits copy into words, flagging the ones wrapped in *asterisks* as emphasised.
 * "content that *converts.*" → [{word:"content"}, {word:"that"}, {word:"converts.", em:true}]
 * Emphasis may span several words: "*right now*".
 */
export function parseEmphasis(text) {
  const tokens = [];
  let em = false;
  for (const raw of text.split(/\s+/).filter(Boolean)) {
    let word = raw;
    const opens = word.startsWith("*");
    if (opens) {
      em = true;
      word = word.slice(1);
    }
    const closes = word.endsWith("*");
    if (closes) word = word.slice(0, -1);
    tokens.push({ word, em });
    if (closes) em = false;
  }
  return tokens;
}

export const stripEmphasis = (text) => text.replace(/\*/g, "");
