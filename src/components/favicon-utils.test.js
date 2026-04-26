import test from 'node:test';
import assert from 'node:assert';
import { getDomain, getFaviconUrls } from '../../src/utils/favicon.js';

test('Extração de domínio', () => {
  assert.strictEqual(getDomain('https://github.com/path'), 'github.com');
  assert.strictEqual(getDomain('http://sub.domain.com.br/'), 'sub.domain.com.br');
});

test('Fallback para localhost/IPs', () => {
  const urlsLocalhost = getFaviconUrls('http://localhost:3000');
  assert.deepStrictEqual(urlsLocalhost, ['http://localhost:3000/favicon.ico', 'http://localhost:3000/favicon.png']);

  const urlsIp = getFaviconUrls('http://192.168.1.1');
  assert.deepStrictEqual(urlsIp, ['http://192.168.1.1/favicon.ico', 'http://192.168.1.1/favicon.png']);
});
