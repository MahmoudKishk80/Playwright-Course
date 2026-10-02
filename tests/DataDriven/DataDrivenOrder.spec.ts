import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";
import { LoginPage } from "./LoginPage.ts";
import { DashboardPage } from "./DashboardPage.ts";
import { CheckoutPage, type PaymentDetails } from "./CheckoutPage.ts";

type TestData = {
  logins: { email: string; password: string; validity: string }[];
  products: string[];
  productToOrder: string;
  missingProduct: string;
  payment: PaymentDetails;
};

const jsonPath = path.join(process.cwd(), "tests", "DataDriven", "test-data", "data.json");
const data: TestData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

const validUser = data.logins.find((user) => user.validity === "valid")!;

function screenshotPath(title: string, suffix = ""): string {
  const fileName = title.replace(/[^a-zA-Z0-9]+/g, "-").replace(/-+$/, "");

  return path.join(process.cwd(), "screenshots", "data-driven", `${fileName}${suffix}.png`);
}

test(`negative - "${data.missingProduct}" is not on the dashboard and cannot be added`, async ({
  page,
}) => {
  const loginObject = new LoginPage(page);
  const dashboardObject = new DashboardPage(page);

  await loginObject.open();
  await loginObject.login(validUser.email, validUser.password);

  await expect(page).toHaveURL(/dashboard/);
  await dashboardObject.waitUntilReady();

  const cartBefore = await dashboardObject.cartItems();

  await expect(dashboardObject.product(data.missingProduct)).toHaveCount(0);

  const cartAfter = await dashboardObject.cartItems();
  expect(cartAfter).toBe(cartBefore);

  await page.screenshot({
    path: screenshotPath(test.info().title),
    fullPage: true,
  });
});

test(`positive - add "${data.productToOrder}" to the cart and fill the checkout form`, async ({
  page,
}) => {
  const loginObject = new LoginPage(page);
  const dashboardObject = new DashboardPage(page);
  const checkoutObject = new CheckoutPage(page);

  await loginObject.open();
  await loginObject.login(validUser.email, validUser.password);

  await expect(page).toHaveURL(/dashboard/);
  await dashboardObject.waitUntilReady();

  for (const product of data.products) {
    await expect(dashboardObject.product(product)).toBeVisible();
  }

  await dashboardObject.addProductToCart(data.productToOrder);
  await expect(dashboardObject.cartCount).toHaveText("1");

  await dashboardObject.openCart();
  await dashboardObject.goToCheckout();

  await checkoutObject.fillPaymentDetails(data.payment);
  await checkoutObject.selectCountry("Italy");

  await dashboardObject.waitUntilReady();
  await page.screenshot({
    path: screenshotPath(test.info().title, "-1-checkout"),
    fullPage: true,
  });

  await checkoutObject.placeOrder();

  await expect(page.getByText(/thank\s*you for the order/i)).toBeVisible();

  await page.screenshot({
    path: screenshotPath(test.info().title, "-2-order-placed"),
    fullPage: true,
  });
});
