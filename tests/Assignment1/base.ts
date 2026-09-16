import { type Page } from "@playwright/test";

export class Base {
  constructor(readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto("https://www.saucedemo.com/");
  }
}
