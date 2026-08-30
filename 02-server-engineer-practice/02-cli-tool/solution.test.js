const { test } = require('node:test');
const assert = require('node:assert/strict');
const { countLinesAndWords } = require('./solution');

// --- 基本的な使い方(正常系) ---

test('countLinesAndWords: 複数行のテキストを正しく数える(末尾に改行あり)', () => {
  const result = countLinesAndWords('Hello world\nThis is a test\n');
  assert.deepEqual(result, { lines: 2, words: 6, characters: 27 });
});

test('countLinesAndWords: 1行だけ、末尾に改行が無い場合も1行として数える', () => {
  const result = countLinesAndWords('Hello world');
  assert.deepEqual(result, { lines: 1, words: 2, characters: 11 });
});

test('countLinesAndWords: 単語の前後や間に余分な空白があっても正しく数える', () => {
  const result = countLinesAndWords('  spaced   out   words  ');
  assert.deepEqual(result, { lines: 1, words: 3, characters: 24 });
});

// --- 境界値 ---

test('countLinesAndWords: 空文字列は lines, words, characters すべて0', () => {
  const result = countLinesAndWords('');
  assert.deepEqual(result, { lines: 0, words: 0, characters: 0 });
});

test('countLinesAndWords: 空白と改行だけのテキストは行数はあるが単語数は0', () => {
  // "   \n  \n" は2行分の空白のみで構成されているため、
  // lines は2だが、意味のある単語は1つも無いので words は0になる。
  const result = countLinesAndWords('   \n  \n');
  assert.deepEqual(result, { lines: 2, words: 0, characters: 7 });
});

test('countLinesAndWords: 空行(何も無い行)が含まれていても行として数える', () => {
  // "a\n\nb\n" は "a" / "" (空行) / "b" の3行から成る。
  const result = countLinesAndWords('a\n\nb\n');
  assert.deepEqual(result, { lines: 3, words: 2, characters: 5 });
});

// --- 異常系 ---

test('countLinesAndWords: 文字列以外(数値)を渡すとTypeErrorになる', () => {
  assert.throws(() => countLinesAndWords(123), TypeError);
});

test('countLinesAndWords: 文字列以外(null)を渡すとTypeErrorになる', () => {
  assert.throws(() => countLinesAndWords(null), TypeError);
});

test('countLinesAndWords: 引数を渡さない(undefined)場合もTypeErrorになる', () => {
  assert.throws(() => countLinesAndWords(undefined), TypeError);
});
