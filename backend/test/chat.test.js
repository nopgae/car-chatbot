// Offline: the Anthropic call is stubbed, so no API key or network is needed.
const test = require('node:test');
const assert = require('node:assert');
const { app, anthropic } = require('../server');

async function post(body) {
  const server = app.listen(0);
  const { port } = server.address();
  try {
    const res = await fetch(`http://localhost:${port}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return { status: res.status, json: await res.json() };
  } finally {
    server.close();
  }
}

test('sends the attached photo to Claude and returns the text block', async () => {
  let sent;
  anthropic.messages.create = async (req) => {
    sent = req;
    return { content: [{ type: 'thinking', thinking: '' }, { type: 'text', text: 'Looks like a Kia EV6.' }] };
  };
  const { status, json } = await post({ message: 'What car is this?', image: 'data:image/png;base64,iVBORw0KGgo=' });
  assert.strictEqual(status, 200);
  assert.strictEqual(json.text, 'Looks like a Kia EV6.');
  assert.strictEqual(sent.model, 'claude-opus-5-5');
  const [img, txt] = sent.messages[0].content;
  assert.deepStrictEqual(img.source, { type: 'base64', media_type: 'image/png', data: 'iVBORw0KGgo=' });
  assert.strictEqual(txt.text, 'What car is this?');
});

test('known cars are answered locally without calling Claude', async () => {
  anthropic.messages.create = async () => { throw new Error('should not be called'); };
  const { status, json } = await post({ message: 'Tell me about the toyota camry' });
  assert.strictEqual(status, 200);
  assert.match(json.text, /Toyota Camry/);
});

test('missing message is a 400', async () => {
  assert.strictEqual((await post({})).status, 400);
});
