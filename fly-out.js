
function template(label, caret, align) {
  return /* html */ `
    <style>
      :host {
        display: inline-block;
      }

      .has-submenu {
        position: relative;
      }

      .menu {
        display: none;
        position: absolute;
      }

      .menu.menu-right {
        right: 0;
      }

      .menu.open {
        display: block;
      }

      button {
        cursor: pointer;
        border: none;
        font-size: 12px;
        padding: 2px 6px 3px;
        background-color: transparent;
      }

      .has-submenu:not(.keyboard) button {
        outline: none;
      }
      
      slot[name=button] {
        display: inline-block;
        vertical-align: middle;
      }

      .dropdown-caret {
        display: inline-block;
        border: 4px solid;
        border-right-color: transparent;
        border-bottom-color: transparent;
        border-left-color: transparent;
      }
    </style>
    <div class="has-submenu" aria-haspopup="true" aria-expanded="false">
      <button type="button" class="has-submenu" part="button">
        <slot name="button">${label}</slot>
        ${caret ? '<span class="dropdown-caret"></span>' : ''}
      </button>
      <slot name="menu" class="menu menu-${align}">
        <slot></slot>
      </slot>
    </div>
  `;
}

function tabState(window, cb) {
  function onTab(ev) {
    if (ev.keyCode === 9) {
      window.removeEventListener('keydown', onTab);
      window.addEventListener('mousedown', onMouseDown, { once: true });
      cb(true);
    }
  }

  function onMouseDown() {
    window.addEventListener('keydown', onTab);
    cb(false);
  }

  window.addEventListener('keydown', onTab);
  return function() {
    window.removeEventListener('keydown', onTab);
    window.removeEventListener('mousedown', onMouseDown);
  };
}

class FlyOutElement extends HTMLElement {
  static _addInstance(el) {
    this._instances.add(el);
    if(this._instances.size === 1) {
      this._stopListening = tabState(el.ownerDocument.defaultView, this._onStateChange);
    }
  }

  static _removeInstance(el) {
    this._instances.delete(el);
    if(this._instances.size === 0) {
      this._stopListening();
    }
  }

  static _onStateChange(usingKeyboard) {
    for(let el of FlyOut._instances) {
      el._tabStateChange(usingKeyboard);
    }
  }

  static get observedAttributes() {
    return ['label'];
  }

  constructor() {
    super();
    this.attachShadow({mode: 'open'});

    this._label = this.getAttribute('label') || '';
    this._menu = null;
    this._hasSetup = false;
    this._isExpanded = false;
  }

  _setup() {
    if(!this._hasSetup) {
      this._hasSetup = true;

      let label = this._label;
      let caret = this.hasAttribute('caret');
      let align = this.getAttribute('align') || 'left';
      this.shadowRoot.innerHTML = template(label, caret, align);

      let root = this.shadowRoot;
      this._menu = root.querySelector('.menu');
      this._submenu = root.querySelector('.has-submenu');
      this._btn = root.querySelector('button');
      this._slotBtn = root.querySelector('slot[name="button"]');
    }
  }

  connectedCallback() {
    this._setup();
    this._registerEvents();
    this.constructor._addInstance(this);
  }

  disconnectedCallback() {
    this._unregisterEvents();
    this.constructor._removeInstance(this);
  }

  attributeChangedCallback(attrName, _, newValue) {
    this[attrName] = newValue;
  }

  get label() {
    return this._label;
  }

  set label(val) {
    this._label = val;
    if(this._slotBtn) {
      this._slotBtn.firstChild.data = val;
    }
  }

  handleEvent(ev) {
    switch(ev.type) {
      case 'click':
        if(ev.currentTarget === this._btn) {
          ev.preventDefault();
          ev.stopPropagation();
          if(!this._isExpanded) {
            this._makeExpanded();
          } else {
            this._makeClosed();
          }
        } else {
          this._makeClosed();
        }
        break;
      case 'mouseenter':
        this._makeExpanded();
        break;
      case 'mouseleave':
        this._makeClosed();
    }
  }

  _registerEvents() {
    if(this.hasAttribute('hover')) {
      this._btn.addEventListener('mouseenter', this);
      this._submenu.addEventListener('mouseleave', this);
    } else {
      this._btn.addEventListener('click', this, true);
    }
    this._btn.addEventListener('keyup', this);
    this.ownerDocument.body.addEventListener('click', this);
  }

  _unregisterEvents() {
    this._btn.removeEventListener('mouseenter', this);
    this._btn.removeEventListener('click', this, true);
    this._btn.removeEventListener('keyup', this);
    this._submenu.removeEventListener('mouseleave', this);
    this.ownerDocument.body.addEventListener('click', this);
  }

  _makeExpanded() {
    if(!this._isExpanded) {
      this._menu.classList.add('open');
      this._submenu.setAttribute('aria-expanded', 'true');
      this.setAttribute('open', '');
      this._isExpanded = true;
    }
  }

  _makeClosed() {
    if(this._isExpanded) {
      this._menu.classList.remove('open');
      this._submenu.setAttribute('aria-expanded', 'false');
      this.removeAttribute('open');
      this._isExpanded = false;
    }
  }

  _tabStateChange(usingKeyboard) {
    this._submenu.classList[usingKeyboard ? 'add' : 'remove']('keyboard');
  }
}

FlyOutElement._instances = new Set();
FlyOutElement._stopListening = null;

customElements.define('fly-out', FlyOutElement);

export default FlyOutElement;