import { expect, type Locator, type Page } from "@playwright/test";
export class Loginadmin {
    //=====================Locators=====================
    readonly page: Page;
    readonly sign_in_btn: Locator;
    readonly sign_in_button: Locator;
    readonly username: Locator;
    readonly pass: Locator;
    readonly invalidloginMessage: Locator;
    readonly invalidemailMessage: Locator;
    readonly emailLabel: Locator;
    readonly passwordLabel: Locator;
    //=====================Variables====================
    readonly url: string = "https://hub-surgia-test.dentacartscloud.net/login";
    //=====================Constructor==================
    constructor(page: Page) {
        this.page = page;
        this.username = page.getByRole('textbox', { name: 'Email Address' });
        this.pass = page.getByRole('textbox', { name: 'Password' });
        this.invalidloginMessage = page.locator("//li[@class='!bg-destructive !text-white']");
        this.invalidemailMessage = page.locator("//div[contains(text(),'Invalid email address')]");
        this.emailLabel = page.getByLabel(/email/i);
        this.passwordLabel = page.getByLabel(/password/i);
        this.sign_in_btn = page.getByRole('button', { name: 'Sign In' });
        this.sign_in_button = page.locator('#kc-login');
    }
    //=====================Methods======================
    async open() {
        await this.page.goto(this.url);
    }
    async login(email: string, password: string) {
        await this.sign_in_btn.click();
        await this.username.fill(email);
        await this.pass.fill(password);
        await this.sign_in_button.click();
    }
    // For backward compatibility
    async loginWithDefault() {
        await this.login("new@mailna.co", "123456");
    }
    async assertInvalidLoginMessageIsVisible() {
        await expect(this.invalidloginMessage).toBeVisible();
    }
}
