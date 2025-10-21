import { insertAfter } from '../helpers/insertHelpers.js';
import { render } from 'preact';
import React from 'preact/compat';
import NotificationPopup from '../components/NotificationPopup/NotificationPopup.js';

export default class DisplayManager {
  constructor() {
    this.notifications = [];
    this.settings = {};

  }
  async initialize({ notifications = [], settings = {} } = {}) {
    this.notifications = Array.isArray(notifications) ? notifications : [];
    this.settings = settings || {};
    console.log('DisplayManager initialized with settings:', this.settings);

    this.insertContainer();

    if (!this.shouldDisplay()) return;

    await this.sleep(this.settings.timeBeforeFirstPop);
    // notifications.forEach
    for (const notification of notifications) {
      await this.display(notification);
      console.log('Displayed notification:', notification);

      await this.sleep(this.settings.displayDuration);

      this.fadeOut();

      await this.sleep(this.settings.gapBetweenPops);
    }
  }

  sleep(s) {
    return new Promise(resolve => setTimeout(resolve, s * 1000));
  }

  fadeOut() {
    const container = document.querySelector('#Avada-SalePop') || this.insertContainer();
    if (container) {
      render(null, container);
    }
  }

  display(notification) {
    const container = document.querySelector('#Avada-SalePop') || this.insertContainer();
    const popup = React.createElement(NotificationPopup, {
      ...notification,
      settings: this.settings
    });
    if (container) {
      render(popup, container);
    }
  }

  insertContainer() {
    const popupEl = document.createElement('div');
    popupEl.id = `Avada-SalePop`;
    popupEl.classList.add('Avada-SalePop__OuterWrapper');
    const bodyEl = document.querySelector('body');
    const targetEl = bodyEl && bodyEl.firstChild;
    if (targetEl) {
      insertAfter(popupEl, targetEl);
    } else if (bodyEl) {
      bodyEl.appendChild(popupEl);
    }

    return popupEl;
  }

  shouldDisplay() {
    const url = window.location.protocol + '//' + window.location.host + window.location.pathname;
    const { allowShow = 'all', includedUrls = '', excludedUrls = '' } = this.settings || {};

    const includedUrlsArray = includedUrls.split('\n').map(u => u.trim()).filter(Boolean);
    const excludedUrlsArray = excludedUrls.split('\n').map(u => u.trim()).filter(Boolean);

    if (excludedUrlsArray.includes(url)) return false;
    if (allowShow === 'all') return true;
    if (allowShow === 'specific') return includedUrlsArray.includes(url);

    return false;
  }
}
