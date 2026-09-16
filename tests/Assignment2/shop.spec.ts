import { test, expect } from "@playwright/test";
import { Shop } from "./shop.ts";

test.use({
  launchOptions: { slowMo: 800 },
});

test("user fills the form and adds the first and last products", async ({ page }) => {
  const shopObject = new Shop(page);

  await shopObject.open();

  await expect(page.getByRole("heading", { name: "Protractor Tutorial" })).toBeVisible();

  await shopObject.fillForm("Kishk", "mahmoud@kishk.com", "Kishk80", "Male");
  await shopObject.submit();

  await expect(page.getByText("The Form has been submitted successfully!")).toBeVisible();

  await shopObject.goToShop();

  await expect(page).toHaveURL("https://rahulshettyacademy.com/angularpractice/shop");

  await shopObject.addFirstAndLastProducts();

  await expect(page.getByText("Checkout ( 2 )")).toBeVisible();
});
