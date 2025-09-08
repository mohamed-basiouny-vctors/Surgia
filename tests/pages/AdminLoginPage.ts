import { expect, type Locator, type Page } from "@playwright/test";
export class AdminLoginPage {
    //=====================Locators=====================
    readonly page: Page;
    readonly sign_in_btn: Locator;
    readonly username: Locator;
    readonly pass: Locator;
    readonly sign_in_button: Locator;
    readonly invalidLoginMessage: Locator;
    //=====================Variables====================
    readonly url: string = "https://admin-surgia-test.dentacartscloud.net/login";
    //=====================Constructor==================
    constructor(page: Page) {
        this.page = page;
        this.username = page.getByRole('textbox', { name: 'Email Address' });
        this.pass = page.getByRole('textbox', { name: 'Password' });
        this.sign_in_btn = page.getByRole('button', { name: 'Sign In' });
        this.sign_in_button = page.locator('#kc-login');
        this.invalidLoginMessage = page.locator("//li[contains(@class, 'bg-destructive')]");
    }
    //=====================Methods======================
    async open() {
        await this.page.goto(this.url);
    }
    async close() {
        await this.page.close();
    }
    async login(email: string, password: string) {
        await this.sign_in_btn.click();
        await this.username.fill(email);
        await this.pass.fill(password);
        await this.sign_in_button.click();
    }
    async assertInvalidLoginMessageIsVisible() {
        await expect(this.invalidLoginMessage).toBeVisible();
    }
} 