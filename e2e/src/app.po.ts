import { browser, by, element } from 'protractor';
import {WebdriverWebElement} from "protractor/built/element";

export class AppPage {
  navigateTo(url: string) {
    return browser.get(browser.baseUrl + url) as Promise<unknown>;
  }

  getTitleText(): Promise<string> {
    return element(by.css('app-header header > div > a')).getText() as Promise<string>;
  }

  getUsernameInput() {
    return element(by.css('.form mat-form-field:nth-of-type(1) input'));
  }

  getPasswordInput() {
    return element(by.css('.form mat-form-field:nth-of-type(2) input'));
  }

  getSubmitButton() {
    return element(by.css('form button'));
  }

  public getShopIcons() {
    return element.all(by.css('.flaticon-shopping-bag'));
  }

  public getCartItemsCount() {
    return element(by.css('.btn-cart small')).getText();
  }

  public async getCartRowProduct() {
    return element.all(by.css('.cart-row-product'));
  }

  public async getPrice() {
    return element.all(by.css('.product-description-wrap p')).getText();
  }

  async getProductLinks() {
    return element.all(by.css('.products-wrap a'));
    // return els.map(el => el.getWebElement().getDriver());
  }
}
