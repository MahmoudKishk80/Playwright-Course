import { type Locator, type Page } from "@playwright/test";
import { BasePage } from "./BasePage.ts";

export class LoginPage extends BasePage {
  private readonly emailField: Locator;
  private readonly passwordField: Locator;
  private readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);

    this.emailField = page.getByPlaceholder("email@example.com");
    this.passwordField = page.getByPlaceholder("enter your passsword");
    this.loginButton = page.getByRole("button", { name: "Login" });
  }

  override async open(): Promise<void> {
    await super.open();
    await this.emailField.waitFor();
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailField.fill(email);

    await this.passwordField.fill(password);

    await this.loginButton.click();
  }
}
