//We can create POM for each page or each pages can be written correctly in POM. 
// Dry - Don't Repeat your cases , KISS - Keep It Simple and Stupid
//It is used for making coding shorter but correct and effort for maintenance is low

import { Locator, Page } from "@playwright/test"; 
import { step } from "../helpers/test-step-decorator" // added a helper to see the data of failed cases elaborately
import { HelperBase } from "./helper-base";

export class NavigationPage{

    private readonly page: Page
    readonly formLayoutsMenu: Locator
    readonly datePickerMenu: Locator
    readonly toasterMenu: Locator
    readonly toolTipMenu: Locator
    readonly smartTableMenu: Locator

    constructor(page: Page){
        this.page = page // Navigation Page Object
        this.datePickerMenu = page.getByText('Datepicker') // Locators in Page Objects
        this.toasterMenu = page.getByText('Toastr') // Locators in Page Objects
        this.formLayoutsMenu = page.getByText('Form Layouts') // Locators in Page Objects
        this.toolTipMenu = page.getByText('Tooltip') // Locators in Page Objects
        this.smartTableMenu = page.getByText('Smart Table') // Locators in Page Objects
    }

    @step
    async formLayoutsPage(){
        await this.selectGroupMenuItem('Forms')
        await this.formLayoutsMenu.click()
        
    }

    @step // This is used to report the failures of exact cases where the failure happens
    async datePickerPage(){

        await this.selectGroupMenuItem('Forms')
        await this.page.waitForTimeout(1000)
        await this.datePickerMenu.click()
    }

    @step
    async toasterPage(){
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.toasterMenu.click()
    }

    @step
    async tooltipPage(){
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.toolTipMenu.click()
    }

    @step
    async smartTablePage(){
        await this.selectGroupMenuItem('Tables & Data')
        await this.smartTableMenu.click()
    }

    private async selectGroupMenuItem(groupMenuTitle: string){
        const groupMenuItem = this.page.getByTitle(groupMenuTitle) // Paramettrized Locators (groupMenuTitle), shared as argument
        const expanedState = await groupMenuItem.getAttribute('aria-expanded')
        if (expanedState=="false"){
            await groupMenuItem.click()
        }
    }


}