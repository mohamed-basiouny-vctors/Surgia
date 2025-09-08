import { expect, type Locator, type Page} from "@playwright/test"; 
export class Leadformpage {
    //=====================Locators=====================
    readonly page: Page; // Create a variable so u create an object that represent the class(note the delecration and object is essential )
    readonly tenant_Name: Locator; 
    readonly tenant_type: Locator; 
    readonly tenant_type_option: Locator;
    readonly City: Locator; 
    readonly City_option: Locator; 
    readonly Contact_Person_firstName: Locator;
    readonly Contact_Person_lastName: Locator;
    readonly Email: Locator;  
    readonly Mobile_prif: Locator; 
    readonly mobileprif_option: Locator; 
    readonly Mobile: Locator; 
    readonly submit_btn: Locator;  
    readonly invalidsubmtionMessage_exist: Locator; 
    readonly invalidsubmtionMessage_success: Locator;
    readonly confirmation_popup: Locator;
    readonly required_asterisk_tenant_name: Locator;
    readonly required_asterisk_contact_person_name: Locator;
    readonly required_asterisk_email: Locator;
    readonly required_asterisk_mobile: Locator;
    readonly mobile_error: Locator;
    readonly name_error: Locator;
    readonly allowed_characters_error: Locator;
    readonly clinic_name_error: Locator;
    readonly contact_person_name_error: Locator;
    readonly email_error: Locator;
    readonly city_dropdown_options: Locator;
    readonly max_name_error: Locator;
    readonly characters_only_error: Locator;
    //=====================Variables====================
    readonly url: string = "https://hub-surgia-test.dentacartscloud.net/register"; 
    readonly invalidsubmtionMessageText: string; 
    //=====================Constructor==================
    constructor(page: Page) {
        this.page = page;
        // Updated locators based on actual form structure
        this.tenant_Name= page.getByPlaceholder('Enter clinic/hospital name');
        this.tenant_type= page.locator('select[name="type"]');
        this.tenant_type_option= page.locator('select[name="type"] option[value="HOSPITAL"]');
        this.City= page.locator('select[name="city_id"]');
        this.City_option= page.locator('select[name="city_id"] option[value="1"]'); // Riyadh has value "1"
        this.Contact_Person_firstName= page.getByPlaceholder('First name');
        this.Contact_Person_lastName= page.getByPlaceholder('Last name');
        this.Email= page.getByPlaceholder('Enter contact email');  
        this.Mobile_prif= page.getByRole('button', { name: '🇸🇦 Sort' }); 
        this.mobileprif_option= page.getByRole('button', { name: '🇸🇦 Sort' }); // Saudi Arabia is already selected
        this.Mobile= page.getByPlaceholder('Enter without country code'); 
        this.submit_btn= page.getByRole('button', { name: 'Submit' });  
        // Updated error message locators based on actual form behavior
        this.invalidsubmtionMessage_exist= page.locator("//p[text()='Required']").first();
        this.invalidsubmtionMessage_success= page.locator("//h2[contains(text(), 'Success')]");
        // Updated confirmation popup locator to look for notification messages
        this.confirmation_popup = page.locator("//div[contains(@class, 'notification') or contains(@class, 'toast') or contains(@class, 'alert')]");
        this.required_asterisk_tenant_name = page.locator("//span[text()='*']").first();
        this.required_asterisk_contact_person_name = page.locator("//span[text()='*']").nth(2);
        this.required_asterisk_email = page.locator("//span[text()='*']").nth(3);
        this.required_asterisk_mobile = page.locator("//span[text()='*']").nth(4);
        // Updated error message locators based on actual form behavior
        this.mobile_error = page.locator("//p[contains(text(), 'Invalid') or contains(text(), 'phone') or contains(text(), 'mobile')]");
        // Fixed to get the first occurrence of the special characters error
        this.allowed_characters_error = page.locator("//p[contains(text(), 'Only characters are allowed')]").first();
        this.clinic_name_error = page.locator("//p[text()='Required']").first();
        this.contact_person_name_error = page.locator("//p[text()='Required']").nth(2);
        this.name_error = page.locator("//p[text()='Required']").first();       
        this.email_error = page.locator("//p[contains(text(), 'Invalid email address')]");
        this.city_dropdown_options = page.locator('select[name="city_id"] option:not([value=""])');
        // Note: The form doesn't have client-side validation for max length, so these locators may not work
        this.max_name_error = page.locator("//p[contains(text(),'Cannot exceed 50 characters')]");
        this.characters_only_error = page.locator("//p[contains(text(), 'Only characters are allowed')]").first();
    }
    
    //=====================Methods====================== note that methods is not like action it's function 
    //---------------------Actions----------------------
    async open(){
        await this.page.goto(this.url); // Open the URL
    }

    async fillform_Exiisting_tenant(tenant_Name_exist: string, Person_firstName: string, Person_lastName: string, Email_in: string, Mobile_in: string){
        await this.tenant_Name.fill(tenant_Name_exist); 
        await this.Contact_Person_firstName.fill(Person_firstName); 
        await this.Contact_Person_lastName.fill(Person_lastName); 
        await this.Email.fill(Email_in); 
        await this.Mobile_prif.click();
        await this.mobileprif_option.click();
        await this.Mobile.fill(Mobile_in);
        // Use JavaScript to set select values
        await this.page.evaluate(() => {
            const typeSelect = document.querySelector('select[name="type"]') as HTMLSelectElement;
            if (typeSelect) {
                typeSelect.value = 'HOSPITAL';
                typeSelect.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
        await this.page.evaluate(() => {
            const citySelect = document.querySelector('select[name="city_id"]') as HTMLSelectElement;
            if (citySelect) {
                citySelect.value = '1';
                citySelect.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
        await this.submit_btn.click();
    }

    async fillform_Exiisting_Email(tenant_Namein: string, Person_firstName: string, Person_lastName: string, Email_exist: string, Mobile_in: string){
        await this.tenant_Name.fill(tenant_Namein); 
        await this.Contact_Person_firstName.fill(Person_firstName); 
        await this.Contact_Person_lastName.fill(Person_lastName); 
        await this.Email.fill(Email_exist); 
        await this.Mobile_prif.click();
        await this.mobileprif_option.click();
        await this.Mobile.fill(Mobile_in);
        // Use JavaScript to set select values
        await this.page.evaluate(() => {
            const typeSelect = document.querySelector('select[name="type"]') as HTMLSelectElement;
            if (typeSelect) {
                typeSelect.value = 'HOSPITAL';
                typeSelect.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
        await this.page.evaluate(() => {
            const citySelect = document.querySelector('select[name="city_id"]') as HTMLSelectElement;
            if (citySelect) {
                citySelect.value = '1';
                citySelect.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
        await this.submit_btn.click();
    }

    async fillform_Exiisting_mobile(tenant_Namein: string, Person_firstName: string, Person_lastName: string, Email_in: string, Mobile_exist: string){
        await this.tenant_Name.fill(tenant_Namein); 
        await this.Contact_Person_firstName.fill(Person_firstName); 
        await this.Contact_Person_lastName.fill(Person_lastName); 
        await this.Email.fill(Email_in); 
        await this.Mobile_prif.click();
        await this.mobileprif_option.click();
        await this.Mobile.fill(Mobile_exist);
        // Use JavaScript to set select values
        await this.page.evaluate(() => {
            const typeSelect = document.querySelector('select[name="type"]') as HTMLSelectElement;
            if (typeSelect) {
                typeSelect.value = 'HOSPITAL';
                typeSelect.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
        await this.page.evaluate(() => {
            const citySelect = document.querySelector('select[name="city_id"]') as HTMLSelectElement;
            if (citySelect) {
                citySelect.value = '1';
                citySelect.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
        await this.submit_btn.click();
    }

    
    //---------------------Assertions-------------------
    async assertInvalidsumbmitMessage_exist(){
        await expect(this.invalidsubmtionMessage_exist).toBeVisible(); // Verify the invalid submition message
    }
    async assertInvalidsumbmitMessage_success(){
        await expect(this.invalidsubmtionMessage_success).toBeVisible(); // Verify the invalid submition message
    }   
    // Note: The form doesn't show a confirmation popup, it shows error messages in notifications
    // async checkConfirmationPopup() {
    //     await expect(this.confirmation_popup).toBeVisible();
    // }
   
    async checkRequiredAsterisks() {
        await expect(this.required_asterisk_tenant_name).toBeVisible();
        await expect(this.required_asterisk_contact_person_name).toBeVisible();
        await expect(this.required_asterisk_email).toBeVisible();
        await expect(this.required_asterisk_mobile).toBeVisible();
    }
    async checkMaxLength(locator: Locator, maxLength: number, testValue: string) {
        await locator.fill(testValue);
        const value = await locator.inputValue();
        expect(value.length).toBeLessThanOrEqual(maxLength);
    }

    async simulateOfflineAndSubmit() {
        await this.page.context().setOffline(true);
        await this.submit_btn.click();
        await this.page.context().setOffline(false);
    }

    async validateTenantNameCharactersOnly() {
        // Test with valid characters only
        await this.tenant_Name.fill('ValidClinicName');
        await expect(this.tenant_Name).toHaveValue('ValidClinicName');
        
        // Test with numbers - should be rejected
        await this.tenant_Name.fill('Clinic123');
        await this.submit_btn.click();
        await expect(this.characters_only_error).toBeVisible();
        
        // Test with special characters - should be rejected
        await this.tenant_Name.fill('Clinic@#$%');
        await this.submit_btn.click();
        await expect(this.characters_only_error).toBeVisible();
        
        // Test with valid characters again to ensure it works
        await this.tenant_Name.fill('ValidClinicName');
        await expect(this.tenant_Name).toHaveValue('ValidClinicName');
    }

    async assertTransientValidationMessage(messageText: string, timeout: number = 10000) {
        // Locate the validation message by its text content
        const messageLocator = this.page.locator(`text=${messageText}`);
        
        // Wait for the message to appear with a reasonable timeout
        await expect(messageLocator).toBeVisible({ timeout });
        
        // Optional: Wait a moment to ensure the message is visible
        await this.page.waitForTimeout(1000);
        
        // Verify the message is still visible after the brief wait
        await expect(messageLocator).toBeVisible();
        
        // If you want to verify the message disappears later, you can add:
        // await expect(messageLocator).not.toBeVisible();
    }

    async assertExistingTenantMessage() {
        await this.assertTransientValidationMessage("Clinic/Hospital Name already exists");
    }
}
