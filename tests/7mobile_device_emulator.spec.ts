import { test, expect } from '@playwright/test';
import { NavigationPage } from '../page-objects/navigation-page'
import { FormLayoutsPage } from '../page-objects/form-layouts-page'
import { Datepickerpage } from '../page-objects/date-picker-page'
import { PageManager } from "../page-objects/page-manager"
import { faker } from "@faker-js/faker"


test.beforeEach(async ({ page }) => {
    await page.goto('https://playground.bondaracademy.com/pages/iot-dashboard')

})

//to check in mobile device add a project in config.ts file with details. then it will work

test('Navigate to form layouts page and fill it up in Mobile Browser view', async ({ page }, testInfo) => {
    const navigateTo = new NavigationPage(page) //calling the constructor

    if(testInfo.project.name=='mobile-test'){
        await page.locator('.sidebar-toggle').click()
    }

     await navigateTo.formLayoutsPage()

    if(testInfo.project.name=='mobile-test'){
        await page.locator('.sidebar-toggle').click()
    }

    const pom = new PageManager(page) // with this we have added all the imports in POM Manager. SO, no need to write const multiple times


    //Use Faker to generate data randomly from Internet
    const randomFullName = faker.person.fullName()
    const randomEmail = faker.internet.email({ provider: 'example.fakerjs.dev' })

    await pom.formLayoutsPage.submitUsingTheGridForm(randomEmail, 'Test@123', 'Option 2')

    await pom.formLayoutsPage.submitGridLine(randomFullName, randomEmail, false)

})

