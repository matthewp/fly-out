
function template(label) {
  return `
    <style>
      :host {
        display: inline-block;
      }

      .menu {
        display: none;
      }

      .menu.open {
        display: block;
      }

      button {
        cursor: pointer;
        border: none;
        font-size: 12px;
        outline: none;
      }
    </style>
    <div class="has-submenu">
      <button type="button" aria-haspopup="true"
        aria-expanded="false" class="has-submenu">${label}</button>
      <slot class="menu"></slot>
    </div>
  `;
}

function notImplemented() {
  throw new Error('Not yet implemented');
}

class FlyOut extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});

    this._menu = null;
    this._hasSetup = false;
    this._isExpanded = false;
  }

  _setup() {
    if(!this._hasSetup) {
      this._hasSetup = true;

      let label = this.getAttribute('label');
      this.shadowRoot.innerHTML = template(label);

      let root = this.shadowRoot;
      this._menu = root.querySelector('.menu');
      this._submenu = root.querySelector('.has-submenu');
      this._btn = root.querySelector('button');
    }
  }

  connectedCallback() {
    this._setup();
    this._registerEvents();
  }

  disconnectedCallback() {
    this._unregisterEvents();
  }

  handleEvent(ev) {
    switch(ev.type) {
      case 'click':
        if(ev.target === this._btn) {
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
      case 'keyup':
        let k = ev.keyCode;
        if(k === 32 || k === 13) {
          if(this._isExpanded) {
            this._makeClosed();
          } else {
            this._makeExpanded();
          }
        }
        break;
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
      this._isExpanded = true;
    }
  }

  _makeClosed() {
    if(this._isExpanded) {
      this._menu.classList.remove('open');
      this._submenu.setAttribute('aria-expanded', 'false');
      this._isExpanded = false;
    }
  }
}

customElements.define('fly-out', FlyOut);