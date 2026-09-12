import { test, expect, type Page } from "@playwright/test";
import { Base } from "./base.ts";

export class Login extends Base {
  constructor(page: Page) {
    super(page);
  }

  override async open(): Promise<void> {
    await super.open();
    await this.page.getByPlaceholder("Username").waitFor();
    await this.page.getByPlaceholder("Password").waitFor();
  }

  async login(): Promise<void> {
    await this.page.getByPlaceholder("Username").fill("standard_user");

    await this.page.getByPlaceholder("Password").fill("secret_sauce");

    await this.page.getByRole("button", { name: "Login" }).click();
  }
}
