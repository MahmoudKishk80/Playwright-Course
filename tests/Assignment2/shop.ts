import { type Locator, type Page } from "@playwright/test";
import { ShopBase } from "./shopBase.ts";

export class Shop extends ShopBase {
  private readonly nameField: Locator;
  private readonly emailField: Locator;
  private readonly passwordField: Locator;
  private readonly iceCreamCheckbox: Locator;
  private readonly genderSelect: Locator;
  private readonly studentRadio: Locator;
  private readonly submitButton: Locator;
  private readonly shopLink: Locator;
  private readonly cards: Locator;

  constructor(page: Page) {
    super(page);

    this.nameField = page.locator('form input[name="name"]');
    this.emailField = page.locator('form input[name="email"]');
    this.passwordField = page.getByPlaceholder("Password");
    this.iceCreamCheckbox = page.getByLabel("Check me out if you Love IceCreams!");
    this.genderSelect = page.getByLabel("Gender");
    this.studentRadio = page.getByLabel("Student");
    this.submitButton = page.getByRole("button", { name: "Submit" });
    this.shopLink = page.getByRole("link", { name: "Shop" });
    this.cards = page.locator("app-card");
  }

  override async open(): Promise<void> {
    await super.open();
    await this.nameField.waitFor();
  }

  async fillForm(
    name: string,
    email: string,
    password: string,
    gender: string
  ): Promise<void> {
    await this.nameField.fill(name);

    await this.emailField.fill(email);

    await this.passwordField.fill(password);

    await this.iceCreamCheckbox.check();

    await this.genderSelect.selectOption(gender);

    await this.studentRadio.check();
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async goToShop(): Promise<void> {
    await this.shopLink.click();
  }

  async addFirstAndLastProducts(): Promise<void> {
    await this.cards.first().getByRole("button", { name: "Add" }).click();

    await this.cards.last().getByRole("button", { name: "Add" }).click();
  }
}
