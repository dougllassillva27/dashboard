import test from 'node:test';
import assert from 'node:assert';
import { handler } from '../../netlify/functions/resolver-favicon.js';

test('Rejeita URL privada (SSRF)', async () => {
  const event = { httpMethod: 'GET', queryStringParameters: { url: 'http://127.0.0.1/admin' } };
  const result = await handler(event);
  assert.strictEqual(result.statusCode, 403);
  assert.match(result.body, /SSRF bloqueado/);
});

test('Retorna erro para método POST', async () => {
  const event = { httpMethod: 'POST' };
  const result = await handler(event);
  assert.strictEqual(result.statusCode, 405);
});

test('Fallback para favicon.ico se HTML falhar', async () => {
  const event = { httpMethod: 'GET', queryStringParameters: { url: 'https://exemplo-nao-existe.com' } };
  const result = await handler(event);
  assert.strictEqual(result.statusCode, 200);
  const body = JSON.parse(result.body);
  assert.strictEqual(body.favicon_url, 'https://exemplo-nao-existe.com/favicon.ico');
});
