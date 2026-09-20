import { type Locator, type Page } from "@playwright/test";
import { OrderE2EBasePage } from "./OrderE2EBasePage.ts";

export class E2EFlow extends OrderE2EBasePage {
  private readonly registerHereLink: Locator;
  private readonly firstNameField: Locator;
  private readonly lastNameField: Locator;
  private readonly emailField: Locator;
  private readonly phoneField: Locator;
  private readonly occupationSelect: Locator;
  private readonly maleRadio: Locator;
  private readonly femaleRadio: Locator;
  private readonly passwordField: Locator;
  private readonly confirmPasswordField: Locator;
  private readonly ageCheckbox: Locator;
  private readonly registerButton: Locator;

  private readonly loginEmailField: Locator;
  private readonly loginPasswordField: Locator;
  private readonly loginButton: Locator;

  private readonly products: Locator;
  private readonly cartLink: Locator;
  private readonly checkoutButton: Locator;

  private readonly cardNumberField: Locator;
  private readonly expiryMonthSelect: Locator;
  private readonly expiryYearSelect: Locator;
  private readonly cvvField: Locator;
  private readonly nameOnCardField: Locator;
  private readonly couponField: Locator;
  private readonly countryField: Locator;
  private readonly countryResults: Locator;

  private readonly spinnerOverlay: Locator;

  constructor(page: Page) {
    super(page);

    this.registerHereLink = page.getByRole("link", { name: "Register" });
    this.firstNameField = page.getByPlaceholder("First Name");
    this.lastNameField = page.getByPlaceholder("Last Name");
    this.emailField = page.getByPlaceholder("email@example.com");
    this.phoneField = page.getByPlaceholder("enter your number");
    this.occupationSelect = page.locator('select[formcontrolname="occupation"]');
    this.maleRadio = page.getByLabel("Male", { exact: true });
    this.femaleRadio = page.getByLabel("Female", { exact: true });
    this.passwordField = page.getByPlaceholder("Passsword", { exact: true });
    this.confirmPasswordField = page.getByPlaceholder("Confirm Passsword");
    this.ageCheckbox = page.locator('input[formcontrolname="required"]');
    this.registerButton = page.getByRole("button", { name: "Register" });

    this.loginEmailField = page.getByPlaceholder("email@example.com");
    this.loginPasswordField = page.getByPlaceholder("enter your passsword");
    this.loginButton = page.getByRole("button", { name: "Login" });

    this.products = page.locator(".card-body");
    this.cartLink = page.getByRole("navigation").getByRole("button", { name: "Cart" });
    this.checkoutButton = page.getByRole("button", { name: "Checkout" });

    const field = page.locator(".field");

    this.cardNumberField = field.filter({ hasText: "Credit Card Number" }).locator("input");
    this.expiryMonthSelect = field.filter({ hasText: "Expiry Date" }).locator("select").first();
    this.expiryYearSelect = field.filter({ hasText: "Expiry Date" }).locator("select").nth(1);
    this.cvvField = field.filter({ hasText: "CVV Code" }).locator("input");
    this.nameOnCardField = field.filter({ hasText: "Name on Card" }).locator("input");
    this.couponField = field.filter({ hasText: "Apply Coupon" }).locator("input");

    this.countryField = page.getByPlaceholder("Select Country");
    this.countryResults = page.locator(".ta-results");

    this.spinnerOverlay = page.locator(".ngx-spinner-overlay").first();
  }

  override async open(): Promise<void> {
    await super.open();
    await this.loginEmailField.waitFor();
  }

  async waitUntilReady(): Promise<void> {
    await this.spinnerOverlay.waitFor({ state: "hidden", timeout: 15000 });
  }

  async register(
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    occupation: string,
    gender: string,
    password: string
  ): Promise<void> {
    await this.registerHereLink.click();

    await this.firstNameField.fill(firstName);

    await this.lastNameField.fill(lastName);

    await this.emailField.fill(email);

    await this.phoneField.fill(phone);

    await this.occupationSelect.selectOption({ label: occupation });

    await (gender === "Female" ? this.femaleRadio : this.maleRadio).check();

    await this.passwordField.fill(password);

    await this.confirmPasswordField.fill(password);

    await this.ageCheckbox.check();

    await this.registerButton.click();
  }

  async openLogin(): Promise<void> {
    await this.page.goto("https://rahulshettyacademy.com/client/#/auth/login", { waitUntil: "domcontentloaded" });
  }

  async login(email: string, password: string): Promise<void> {
    await this.loginEmailField.fill(email);

    await this.loginPasswordField.fill(password);

    await this.loginButton.click();
  }

  async addProductToCart(name: string): Promise<void> {
    await this.products
      .filter({ hasText: name })
      .getByRole("button", { name: "Add To Cart" })
      .click();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async goToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async fillPaymentDetails(
    cardNumber: string,
    expiryMonth: string,
    expiryYear: string,
    cvv: string,
    nameOnCard: string,
    coupon: string
  ): Promise<void> {
    await this.cardNumberField.fill(cardNumber);

    await this.expiryMonthSelect.selectOption({ label: expiryMonth });

    await this.expiryYearSelect.selectOption({ label: expiryYear });

    await this.cvvField.fill(cvv);

    await this.nameOnCardField.fill(nameOnCard);

    await this.couponField.fill(coupon);
  }

  async selectCountry(country: string): Promise<void> {
    await this.countryField.pressSequentially(country);

    await this.countryResults.getByRole("button", { name: country }).click();
  }
}
