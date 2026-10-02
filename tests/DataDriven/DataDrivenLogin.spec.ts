import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";
import { LoginPage } from "./LoginPage.ts";

type LoginCase = {
  email: string;
  password: string;
  validity: string;
};

const jsonPath = path.join(process.cwd(), "tests", "DataDriven", "test-data", "data.json");
const loginData: LoginCase[] = JSON.parse(fs.readFileSync(jsonPath, "utf-8")).logins;

function screenshotPath(title: string, suffix = ""): string {
  const fileName = title.replace(/[^a-zA-Z0-9]+/g, "-").replace(/-+$/, "");

  return path.join(process.cwd(), "screenshots", "data-driven", `${fileName}${suffix}.png`);
}

for (const { email, password, validity } of loginData) {
  test(`login test for ${email || "empty credentials"} (${validity})`, async ({ page }) => {
    const loginObject = new LoginPage(page);

    await loginObject.open();
    await loginObject.login(email, password);

    if (validity.toLowerCase() === "valid") {
      await expect(page).toHaveURL(/dashboard/);
      await expect(page.getByRole("navigation").getByRole("button", { name: "Cart" })).toBeVisible();
    } else {
      const errorMessage = page
        .locator("#toast-container")
        .or(page.getByText("*Email is required"));

      await expect(errorMessage.first()).toBeVisible();
      await expect(page).toHaveURL(/auth\/login/);
    }

    await page.screenshot({
      path: screenshotPath(test.info().title),
      fullPage: true,
    });
  });
}
