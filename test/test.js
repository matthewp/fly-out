import FlyOut from '../fly-out.js';

QUnit.module('fly-out');

QUnit.test('Label changes when the attribute changes', assert => {
  let flyout = new FlyOut();
  flyout.setAttribute('label', 'Test');
  document.body.append(flyout);

  let slot = flyout.shadowRoot.querySelector('slot[name=button]');
  assert.equal(slot.textContent, 'Test');

  flyout.setAttribute('label', 'Test2');
  assert.equal(slot.textContent, 'Test2');
  flyout.remove();
});

QUnit.test('Label changes when the property changes', assert => {
  let flyout = new FlyOut();
  flyout.label = 'Test';
  document.body.append(flyout);

  let slot = flyout.shadowRoot.querySelector('slot[name=button]');
  assert.equal(slot.textContent, 'Test');

  flyout.label = 'Test2';
  assert.equal(slot.textContent, 'Test2');
  flyout.remove();
});