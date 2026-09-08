import { test as base } from '@playwright/test';
import { PageManager } from './page-objects/page-manager';

type FistureTypes ={
    pom: PageManager
}

export const test = base.extend<FistureTypes>({

    pom: async({page},use) => {

        await page.goto('/')
        const manager = new PageManager(page)
        await use(manager)
    }
})