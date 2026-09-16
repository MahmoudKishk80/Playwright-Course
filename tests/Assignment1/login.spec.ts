import { test, expect } from "@playwright/test";
import { Login } from "./login.ts";

test.use({
  launchOptions: { slowMo: 800 },
});

test("user login", async ({ page }) => {
  const loginObject = new Login(page);

  await loginObject.open();
  await loginObject.login("standard_user", "secret_sauce");

  await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
  await expect(page.getByText("Swag Labs")).toBeVisible();
});
