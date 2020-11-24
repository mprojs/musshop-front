import {browser, by, element, logging, protractor} from 'protractor';
import {AppPage} from './app.po';

describe('Basic tests', () => {
  let page: AppPage;

  page = new AppPage();
  // beforeEach(() => {
  //   page = new AppPage();
  // });

  it('Should redirect to auth page if open wishlist', async () => {
    await page.navigateTo('/cart/wishlist');
    let url = await browser.getCurrentUrl();
    expect(url).toContain('auth/signin');
    expect(url).toContain('wishlist');
  });

  it('Should add products to cart', async () => {
    await page.navigateTo('/shop?count=12&onlyInStock=true');
    let shopIcons = await page.getShopIcons();
    for (let i = 1; i < 4; i++) {
      shopIcons[i].click();
      await browser.sleep(300);
      const EC = protractor.ExpectedConditions;
      const elm = element(by.css(".progress-fixed"));
      await browser.wait(EC.invisibilityOf(elm), 10000);
    }
    await expect(page.getCartItemsCount()).toEqual('3');
    // await browser.sleep(50000000);
  });

  it('Should has 3 products in cart', async () => {
    await page.navigateTo('/cart');
    let productRows = await page.getCartRowProduct();
    // console.log(productRows);
    await expect(productRows.length).toEqual(4); // 1 added for title row
  });

  it('should display name in header', () => {
    page.navigateTo('');
    expect(page.getTitleText()).toEqual('MUSICAL STORE');
    // browser.sleep(6000000);
  });

  it('should set data to local storage on auth', async () => {
    await page.navigateTo('/auth/signin');
    page.getUsernameInput().sendKeys('igor2@letup.date');
    page.getPasswordInput().sendKeys('asdfasdf');
    page.getSubmitButton().click();
    await browser.sleep(300);
    const EC = protractor.ExpectedConditions;
    const elm = element(by.css(".progress-fixed"));
    browser.wait(EC.invisibilityOf(elm), 10000);
    let userCookie = await browser.manage().getCookie('user');
    let user;
    if (userCookie && userCookie.value) {
      user = JSON.parse(decodeURIComponent(userCookie.value));
    } else {
      user = {
        username: ''
      }
    }
    expect(user.username).toEqual('igor2');
  });

  it('Should has 3 products in cart after singin', async () => {
    await page.navigateTo('/cart');
    let productRows = await page.getCartRowProduct();
    await expect(productRows.length).toEqual(4); // 1 added for title row
    // await browser.sleep(2000);
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});

jasmine.DEFAULT_TIMEOUT_INTERVAL = 2147483647;

describe('Memory tests', () => {
  let page: AppPage;

  page = new AppPage();

  // it('Should not increace memory usage', async () => {
  //
  //   let count = 2000000;
  //   for (let i = 0; i < count; i++) {
  //     await page.navigateTo('/shop?categories=0&count=6');
  //     browser.sleep(100);
  //     let linkEls = await page.getProductLinks();
  //     let urls = [];
  //     for (let el of linkEls) {
  //       let url = await el.getWebElement().getAttribute('href');
  //       if (url) {
  //         urls.push(url);
  //       }
  //     }
  //     console.log(urls);
  //     let url = urls[Math.floor(Math.random() * urls.length)]
  //     if (url) {
  //       await page.navigateTo(url.replace('http://localhost:4200', ''));
  //       browser.sleep(500);
  //       let price = await page.getPrice();
  //       if (price.toString().substr(0, 1) !== '$') {
  //         console.log('Price:', price);
  //         browser.sleep(3000);
  //       }
  //     } else {
  //       console.log('NO URL');
  //     }
  //   }
  //
  //   let url = await browser.getCurrentUrl();
  //   expect(url).toContain('?');
  // });
});
