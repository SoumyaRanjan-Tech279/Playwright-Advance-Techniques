import { test, expect } from '@playwright/test';
import { NavigationPage } from '../page-objects/navigation-page'
import { FormLayoutsPage } from '../page-objects/form-layouts-page'
import { Datepickerpage } from '../page-objects/date-picker-page'
import { PageManager } from "../page-objects/page-manager"
import { faker } from "@faker-js/faker"


test.beforeEach(async ({ page }) => {
  await page.goto('/') // As we mentioned the application url in Playwright Config file. Only one / is enough to call the baseurl

})

test('Navigate to form layouts page', async ({ page }) => {
  const navigateTo = new NavigationPage(page) //calling the constructor

  await navigateTo.formLayoutsPage()
  await navigateTo.datePickerPage()
  await navigateTo.toasterPage()
  await navigateTo.tooltipPage()
  await navigateTo.smartTablePage()

})

test('Parametrized page Object methods', async ({ page }) => {
  const navigateTo = new NavigationPage(page)
  const formLayoutsPage = new FormLayoutsPage(page)

  await navigateTo.formLayoutsPage()
  await formLayoutsPage.submitUsingTheGridForm(process.env.TEST_USER_EMAIL!, process.env.TEST_USER_PASSWORD!, 'Option 2')

  await formLayoutsPage.submitGridLine('SRS SAS', 'TEST123@gmail.com', false)

})

test('Parametrized page Object methods with Date Picker changes', async ({ page }, testInfo) => {

  //test.describe.configure({retries:2}) // Retry used for no. of tries done for this particular test 2 times if it fails 1st time

  if(testInfo.retry){
    //clean test data for future instance use in new browser
  }

  const pom = new PageManager(page) // with this we have added all the imports in POM Manager. SO, no need to write const multiple times


  //Use Faker to generate data randomly from Internet
  const randomFullName = faker.person.fullName()
  const randomEmail = faker.internet.email({ provider: 'example.fakerjs.dev' })

  await pom.navigateTo.formLayoutsPage() // need to add pom to make sure POM Manager handles it automatically
  await pom.formLayoutsPage.submitUsingTheGridForm(randomEmail, 'Test@123', 'Option 2')

  await pom.formLayoutsPage.submitGridLine(randomFullName, randomEmail, false)

  // Taking Screenshots of the page manually using code
  await page.waitForTimeout(500)
  await page.screenshot({path:'screenshots/formlayoutsPage.png'})

  // Below is used to send the decoded version for the screenshot to use externally of other use
  const formLayoutPageBuffer = await page.screenshot()
  console.log(formLayoutPageBuffer.toString('base64'))

  //take screenshot for some specific section, not the entire screen
  await page.locator('nb-card',{hasText:"Inline form"}).screenshot({path:'screenshots/InlineForm.png'})



})