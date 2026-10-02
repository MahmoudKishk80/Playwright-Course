import { type Locator, type Page } from "@playwright/test";
import { BasePage } from "./BasePage.ts";

export class DashboardPage extends BasePage {
  private readonly productCards: Locator;
  private readonly cartLink: Locator;
  private readonly checkoutButton: Locator;
  private readonly spinnerOverlay: Locator;

  constructor(page: Page) {
    super(page);

    this.productCards = page.locator(".card-body");
    this.cartLink = page.getByRole("navigation").getByRole("button", { name: "Cart" });
    this.checkoutButton = page.getByRole("button", { name: "Checkout" });
    this.spinnerOverlay = page.locator(".ngx-spinner-overlay").first();
  }

  product(name: string): Locator {
    return this.productCards.filter({ hasText: name });
  }

  get cartCount(): Locator {
    return this.cartLink.locator("label");
  }

  async cartItems(): Promise<string> {
    if ((await this.cartCount.count()) === 0) {
      return "0";
    }

    return (await this.cartCount.innerText()).trim();
  }

  async waitUntilReady(): Promise<void> {
    await this.spinnerOverlay.waitFor({ state: "hidden", timeout: 15000 });
  }

  async addProductToCart(name: string): Promise<void> {
    await this.product(name).getByRole("button", { name: "Add To Cart" }).click();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async goToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
