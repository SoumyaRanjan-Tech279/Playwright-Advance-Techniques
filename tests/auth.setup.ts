// This is used to make sure if logins or any task is done through out all the test cases without logout of use

import { test as setup, expect , request } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page, request }) => {

    if (fs.existsSync(authFile)) {
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

        const storageStateFile = JSON.parse(fs.readFileSync(authFile,'utf-8'))
        storageStateFile.origins[0].localStorage[0].value = token
        fs.writeFileSync(authFile, JSON.stringify(storageStateFile, null, 2))

    }
    else {
        await page.goto('https://conduit.bondaracademy.com/');
        await page.getByText('Sign in').click()
        await page.getByRole('textbox', { name: 'Email' }).fill('LBTEST123@gmail.com')
        await page.getByRole('textbox', { name: 'Password' }).fill('Test@123')
        await page.getByRole('button', { name: 'Sign in' }).click()

        await page.waitForURL('https://conduit.bondaracademy.com/');

        await expect(page.getByRole('link', { name: ' New Article ' })).toBeVisible();

        await page.context().storageState({ path: authFile });
    }


});