import path from "path";
import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { E2EFlow } from "./E2EFlow.ts";

test.use({
  launchOptions: { slowMo: 300 },
});

const email = faker.internet.email();
const password = faker.internet.password({ length: 10, prefix: "Kishk@80" });
const phone = faker.string.numeric(10);

test("user registers, logs in and checks out a Zara product", async ({ page }) => {
  test.setTimeout(240000);

  const userObject = new E2EFlow(page);

  await userObject.open();
  await userObject.register("Mahmoud", "Kishk", email, phone, "Student", "Male", password);

  await expect(page.getByText("Account Created Successfully")).toBeVisible();

  await userObject.openLogin();
  await userObject.login(email, password);

  await expect(page.getByRole("navigation").getByRole("button", { name: "Cart" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "ZARA COAT 3" })).toBeVisible();
  await expect(page.getByText("Login Successfully")).toBeHidden({ timeout: 15000 });
  await userObject.waitUntilReady();

  await page.screenshot({ path: path.join(__dirname, "1-after-login.png"), fullPage: true });

  await userObject.addProductToCart("ZARA COAT 3");

  await expect(page.getByRole("navigation").getByRole("button", { name: "Cart" }).locator("label")).toHaveText("1");
  await userObject.waitUntilReady();

  await page.screenshot({ path: path.join(__dirname, "2-after-add-to-cart.png"), fullPage: true });

  await userObject.openCart();
  await userObject.goToCheckout();

  await userObject.fillPaymentDetails(
    "4542 8080 8080 2293",
    "08",
    "08",
    "808",
    "Mahmoud Kishk",
    "rahulshettyacademy"
  );

  await userObject.waitUntilReady();

  await page.screenshot({ path: path.join(__dirname, "3-after-checkout-info.png"), fullPage: true });
});
