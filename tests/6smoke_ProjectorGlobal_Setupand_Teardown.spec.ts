import { test, expect } from '@playwright/test';

test('Smoke Test for Project setup and teardown1', {tag:['@radio']},async ({ page, request }) => {
    console.log("Run Radio Tag")
}
)

test('Smoke Test for Project setup and teardown', {tag:['@smoke']},async ({ page, request }) => {
    //Login To UI
    const loginResponse = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: {
            "user": {
                "email": "LBTEST123@gmail.com",
                "password": "Test@123"
            }
        }
    })

    expect(loginResponse.status()).toEqual(200)
    const responseLoginJson = await loginResponse.json()
    const token = responseLoginJson.user.token
    console.log(token)

    //Create New Ariticle
    const newArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
        data: {
            "article": {
                "title": "TEST_NEW4",
                "description": "test Art1",
                "body": "test article new2",
                "tagList": [
                    "test test1 test2"
                ]
            }
        }, headers: {
            Authorization: `Token ${token}`
        }
    })

    expect(newArticleResponse.status()).toEqual(201)

    // Delete from UI
    await page.goto('https://conduit.bondaracademy.com/');

    if (await page.getByText('Sign in').isVisible()) {
        await page.getByText('Sign in').click()
        await page.getByRole('textbox', { name: 'Email' }).fill('LBTEST123@gmail.com')
        await page.getByRole('textbox', { name: 'Password' }).fill('Test@123')
        await page.getByRole('button', { name: 'Sign in' }).click()
    }


    await expect(page.locator('.preview-link h1').first()).toContainText('TEST_NEW4')
    await page.getByText('TEST_NEW4').click()
    await page.getByRole('button', { name: 'Delete Article' }).first().click()

    //check assertion for 1st title if deleted or not
    await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0')
    await expect(page.locator('.preview-link h1').first()).not.toContainText('TEST_NEW4')

})