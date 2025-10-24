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

    if (!this.shouldDisplay()) {
      console.log('DisplayManager: Notifications will not be displayed on this URL.');
      return;
    }
    await this.sleep(this.settings.timeBeforeFirstPop);
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
    console.log(includedUrls, excludedUrls);

    const includedUrlsArray = includedUrls.split('\n').map(u => u.trim()).filter(u => u);
    const excludedUrlsArray = excludedUrls.split('\n').map(u => u.trim()).filter(u => u);
    console.log('Included URLs:', includedUrlsArray);
    console.log('Excluded URLs:', excludedUrlsArray);
    if (allowShow === 'all') {
      return !excludedUrlsArray.includes(url);
    }
    if (allowShow === 'specific') {
      const isIncluded = includedUrlsArray.some(u => url.includes(u));
      const isExcluded = excludedUrlsArray.some(u => url.includes(u));
      return isIncluded && !isExcluded;
    }
  }
}