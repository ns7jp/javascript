const { test } = require('node:test');
const assert = require('node:assert/strict');
const { validateConfig, loadConfigWithEnvOverride } = require('./solution');

// --- validateConfig のテスト ---

test('validateConfig: 正しい設定であれば何もthrowされない', () => {
  assert.doesNotThrow(() => {
    validateConfig({ serviceName: 'my-web-service', port: 3000 });
  });
});

test('validateConfig: serviceNameが存在しない場合はthrowする', () => {
  assert.throws(() => {
    validateConfig({ port: 3000 });
  }, /serviceName/);
});

test('validateConfig: serviceNameが空白だけの文字列の場合はthrowする', () => {
  assert.throws(() => {
    validateConfig({ serviceName: '   ', port: 3000 });
  }, /serviceName/);
});

test('validateConfig: serviceNameが文字列でない場合はthrowする', () => {
  assert.throws(() => {
    validateConfig({ serviceName: 12345, port: 3000 });
  }, /serviceName/);
});

test('validateConfig: portが数値でない(文字列の)場合はthrowする', () => {
  assert.throws(() => {
    validateConfig({ serviceName: 'my-web-service', port: '3000' });
  }, /port/);
});

test('validateConfig: portが整数でない(小数の)場合はthrowする', () => {
  assert.throws(() => {
    validateConfig({ serviceName: 'my-web-service', port: 3000.5 });
  }, /port/);
});

test('validateConfig: 境界値として、portが範囲外(0や65536)の場合はthrowする', () => {
  assert.throws(() => {
    validateConfig({ serviceName: 'my-web-service', port: 0 });
  }, /port/);
  assert.throws(() => {
    validateConfig({ serviceName: 'my-web-service', port: 65536 });
  }, /port/);
});

test('validateConfig: 境界値として、portが範囲の両端(1と65535)であれば通る', () => {
  assert.doesNotThrow(() => {
    validateConfig({ serviceName: 'my-web-service', port: 1 });
  });
  assert.doesNotThrow(() => {
    validateConfig({ serviceName: 'my-web-service', port: 65535 });
  });
});

test('validateConfig: configがnullや配列、オブジェクトでない値の場合はthrowする', () => {
  assert.throws(() => validateConfig(null));
  assert.throws(() => validateConfig(['serviceName', 'port']));
  assert.throws(() => validateConfig('not-an-object'));
  assert.throws(() => validateConfig(undefined));
});

// --- loadConfigWithEnvOverride のテスト ---

test('loadConfigWithEnvOverride: env.PORTが指定されている場合は数値に変換してportを上書きする', () => {
  const config = { serviceName: 'my-web-service', port: 3000 };
  const env = { PORT: '4000' };

  const result = loadConfigWithEnvOverride(config, env);

  assert.equal(result.port, 4000);
  assert.equal(typeof result.port, 'number');
  assert.equal(result.serviceName, 'my-web-service');
});

test('loadConfigWithEnvOverride: env.PORTが指定されていない場合はconfigの値をそのまま使う', () => {
  const config = { serviceName: 'my-web-service', port: 3000 };
  const env = {};

  const result = loadConfigWithEnvOverride(config, env);

  assert.deepEqual(result, { serviceName: 'my-web-service', port: 3000 });
});

test('loadConfigWithEnvOverride: 元のconfigオブジェクトを書き換えない(純粋関数である)', () => {
  const config = { serviceName: 'my-web-service', port: 3000 };
  const env = { PORT: '5000' };

  const result = loadConfigWithEnvOverride(config, env);

  // 元のオブジェクトのportは3000のまま変わっていないはず
  assert.equal(config.port, 3000);
  // 戻り値は元のオブジェクトとは別の新しいオブジェクトであるはず
  assert.notEqual(result, config);
});

test('loadConfigWithEnvOverride: env.PORTが数値に変換できない文字列の場合はthrowする', () => {
  const config = { serviceName: 'my-web-service', port: 3000 };
  const env = { PORT: 'not-a-number' };

  assert.throws(() => {
    loadConfigWithEnvOverride(config, env);
  }, Error);
});
