import { type Locator, type Page } from "@playwright/test";
import { BasePage } from "./BasePage.ts";

export type PaymentDetails = {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  nameOnCard: string;
  coupon: string;
};

export class CheckoutPage extends BasePage {
  private readonly cardNumberField: Locator;
  private readonly expiryMonthSelect: Locator;
  private readonly expiryYearSelect: Locator;
  private readonly cvvField: Locator;
  private readonly nameOnCardField: Locator;
  private readonly couponField: Locator;
  private readonly countryField: Locator;
  private readonly countryResults: Locator;
  private readonly placeOrderButton: Locator;

  constructor(page: Page) {
    super(page);

    const field = page.locator(".field");

    this.cardNumberField = field.filter({ hasText: "Credit Card Number" }).locator("input");
    this.expiryMonthSelect = field.filter({ hasText: "Expiry Date" }).locator("select").first();
    this.expiryYearSelect = field.filter({ hasText: "Expiry Date" }).locator("select").nth(1);
    this.cvvField = field.filter({ hasText: "CVV Code" }).locator("input");
    this.nameOnCardField = field.filter({ hasText: "Name on Card" }).locator("input");
    this.couponField = field.filter({ hasText: "Apply Coupon" }).locator("input");

    this.countryField = page.getByPlaceholder("Select Country");
    this.countryResults = page.locator(".ta-results");
    this.placeOrderButton = page.getByText("Place Order").first();
  }

  async fillPaymentDetails(payment: PaymentDetails): Promise<void> {
    await this.cardNumberField.fill(payment.cardNumber);

    await this.expiryMonthSelect.selectOption({ label: payment.expiryMonth });

    await this.expiryYearSelect.selectOption({ label: payment.expiryYear });

    await this.cvvField.fill(payment.cvv);

    await this.nameOnCardField.fill(payment.nameOnCard);

    await this.couponField.fill(payment.coupon);
  }

  async placeOrder(): Promise<void> {
    await this.placeOrderButton.click();
  }

  async selectCountry(country: string): Promise<void> {
    await this.countryField.pressSequentially(country);

    await this.countryResults.getByRole("button", { name: country }).click();
  }
}
