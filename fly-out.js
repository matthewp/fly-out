
function template(label, caret, align) {
  return `
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
        font-size: var(--button-font-size, 12px);
        color: var(--button-color);
        padding: var(--button-padding, 2px 6px 3px);
        outline: none;
        background-color: var(--button-background-color);
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
      <button type="button" class="has-submenu">
        <slot name="button">${label}</slot>
        ${caret ? '<span class="dropdown-caret"></span>' : ''}
      </button>
      <slot name="menu" class="menu menu-${align}">
        <slot></slot>
      </slot>
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

      let label = this.getAttribute('label') || '';
      let caret = this.hasAttribute('caret');
      let align = this.getAttribute('align') || 'left';
      this.shadowRoot.innerHTML = template(label, caret, align);

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
}

customElements.define('fly-out', FlyOut);