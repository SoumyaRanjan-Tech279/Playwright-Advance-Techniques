import { test, expect } from '@playwright/test';
import tags from '../test-data/tags.json'


test('API Testing Example 1', async ({ page }) => {

    await page.route('https://conduit-api.bondaracademy.com/api/tags', async route => {

        // https://conduit-api.bondaracademy.com/api/tags --> base URL
        // */**/api/tags --> we can use this for multiple 

        await route.fulfill({
            //Body Property is used to send the response body as a string or Buffer. If you want to send JSON data, you can use the json property instead of body.
            //body: JSON.stringify(tags)

            //Json Property is used to send the response body as JSON. It automatically sets the Content-Type header to application/json and serializes the provided object to a JSON string.
            json: tags

        })


    })

    await page.route('*/**/api/articles*', async route => {

        const response = await route.fetch()
        const responseJSON = await response.json()

        responseJSON.articles[0].title = 'This is mock title for the article'
        responseJSON.articles[0].description = 'This is mock Description for the article'

        await route.fulfill({
            json: responseJSON
        })

    })

    await page.goto('https://conduit.bondaracademy.com/');

    await expect(page.locator('.navbar-brand')).toHaveText(/conduit/)

    await expect(page.locator('.sidebar .tag-pill')).toContainText(['Automation', 'Playwright'])

    await expect(page.locator('.preview-link h1').first()).toContainText('This is mock title for the article')

    await expect(page.locator('.preview-link p').first()).toContainText('This is mock Description for the article')

})

test('Create-Delete UI Article', async ({ page, request }) => {
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