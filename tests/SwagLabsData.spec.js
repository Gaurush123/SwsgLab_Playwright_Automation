// @ts-check
import { test, expect } from '@playwright/test';
import { environments } from '../testdata/environments.js';
import { SwagLabs } from '../pages/SwagLabs.js';
import { SwagLabsData } from '../testdata/SwagLabsData.js';
import { users } from '../testdata/users.js';

test.describe('Test Login feature', () => {

  test('Swag Lab E2E Flow', async ({ page }) => {
    const swagLabs = new SwagLabs(page);
    
    try {
      await page.goto(environments.loginUrl);
      
      // Step 1: Successful Login
      await swagLabs.loginOnPage(users.validDetails.username, users.validDetails.password);
      //uncomment if you wish to debug the page
      //await page.pause(); 
      await expect(page).toHaveURL(environments.inventoryUrl);
      await expect(page).toHaveTitle(SwagLabsData.pageTitle);

      // Step 2: Product Interaction
      await swagLabs.addItemToCart();
      await expect(swagLabs.productQuantity.nth(0)).toHaveText('1');
      await expect(swagLabs.productQuantity.nth(1)).toHaveText('1');

      // Step 3: Product checkout
      await swagLabs.checkout(SwagLabsData.firstName, SwagLabsData.lastName, SwagLabsData.zip);
      await expect(swagLabs.itemTotalLabel).toContainText(await swagLabs.getItemAmount());
      await expect(swagLabs.taxLabel).toContainText(await swagLabs.getTaxAmount());
      
      const isCalculationCorrect = await swagLabs.validateTotalCalculation();
      expect(isCalculationCorrect).toBe(true);

      //Step 4 Finish checkout
      await swagLabs.finish();
      await expect(swagLabs.thankYouLabel).toHaveText(SwagLabsData.confirmationMessage);

      // Step 5: Logout
      await swagLabs.logout();
      await expect(swagLabs.loginButton).toBeVisible();
      
    } catch (error) {
      console.error('Test failed with error:', error.message);
      // Take screenshot on failure
      throw error; // Re-throw to fail the test
    }
  });

});


