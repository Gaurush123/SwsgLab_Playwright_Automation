// @ts-check
import { test, expect } from '@playwright/test';
import { users } from '../testdata/users'; 

export class SwagLabs {
  constructor(page) {
    this.page = page;
    // Define web elements as class properties
    this.userName = page.locator('#user-name'); // use css selector
    this.password = page.locator('xpath=//input[@id="password"]'); //use xpath
    this.loginButton = page.locator('#login-button'); //use getByText method
    this.sauceLabsBackpackCart =  page.locator('#add-to-cart-sauce-labs-backpack');
    this.SauceLabsBoltTShirtCart =  page.locator('#add-to-cart-sauce-labs-bolt-t-shirt');  // data-testid
    this.cartIcon = page.locator('#shopping_cart_container');
    this.sauceLabsBackpackItem =  page.getByText('Sauce Labs Backpack');
    this.SauceLabsBoltTShirtItem =  page.getByText('Sauce Labs Bolt T-Shirt');
    this.productQuantity =  page.locator('.cart_quantity');
    this.checkoutButton =  page.locator('#checkout');
    this.firstName =  page.locator('#first-name');
    this.lastName =  page.locator('#last-name');
    this.postalCode =  page.locator('#postal-code');
    this.continueButton =  page.locator('#continue');
    this.itemTotalLabel=page.locator('.summary_subtotal_label');
    this.taxLabel=page.locator('.summary_tax_label');
    this.totalLabel=page.locator('.summary_total_label');
    this.finishButton=page.locator('#finish');
    this.thankYouLabel=page.locator('.complete-header');
    this.backToHomeButton=page.locator('#back-to-products');
    this.hamBurgerMenu=page.locator('.bm-burger-button');
    this.logoutLink=page.locator('#logout_sidebar_link');
  }

  
   async loginOnPage(username, password) {
    await this.userName.fill(username);
    await this.password.fill(password);
    await this.loginButton.click();
  }
  async addItemToCart() {
    await this.sauceLabsBackpackCart.click();
    await this.SauceLabsBoltTShirtCart.click();
    await this.cartIcon.click();
  }

  async checkout(firstName, lastName, postalCode) {
    try {
      await this.checkoutButton.click();
      await this.firstName.fill(firstName);
      await this.lastName.fill(lastName);
      await this.postalCode.fill(postalCode);
      await this.continueButton.click();
    } catch (error) {
      console.error('Checkout process failed:', error.message);
      throw error;
    }
  }
  async getItemAmount() {
  const totalText = await this.itemTotalLabel.textContent();
  // Extract numeric value
  const itemAmount = totalText.replace('Item total: $', '');
 // console.log(itemAmount);
  return itemAmount;
}
  async getTaxAmount() {
  const totalText = await this.taxLabel.textContent();
  const taxAmount = totalText.replace('Tax: $', '');
  //console.log(taxAmount);
  return taxAmount;
}
 async getTotalAmount() {
  const totalText = await this.totalLabel.textContent();
  const totalAmount = totalText.replace('Total: $', '');
  //console.log(totalAmount);
  return totalAmount;
}
async validateTotalCalculation() {
  try {
    const itemAmount = parseFloat(await this.getItemAmount());
    const taxAmount = parseFloat(await this.getTaxAmount());
    const totalAmount = parseFloat(await this.getTotalAmount());
    
    const calculatedTotal = itemAmount + taxAmount;
    return calculatedTotal === totalAmount;
    
  } catch (error) {
    console.error('Error in total calculation validation:', error.message);
    return false;
  }
}
async finish() {
  await this.finishButton.click();
}

async logout() {
  await this.backToHomeButton.click();
  await this.hamBurgerMenu.click();
  await this.logoutLink.click();
}
}

