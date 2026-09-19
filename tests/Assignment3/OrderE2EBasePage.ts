import { type Page } from "@playwright/test";

export class OrderE2EBasePage {
  constructor(protected readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto("https://rahulshettyacademy.com/client");
  }
}
