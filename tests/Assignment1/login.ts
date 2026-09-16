import { type Page } from "@playwright/test";
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

  async login(username: string, password: string): Promise<void> {
    await this.page.getByPlaceholder("Username").fill(username);

    await this.page.getByPlaceholder("Password").fill(password);

    await this.page.getByRole("button", { name: "Login" }).click();
  }
}
