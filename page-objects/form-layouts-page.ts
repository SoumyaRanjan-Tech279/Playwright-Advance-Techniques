import { Page } from "@playwright/test";
import { step } from "../helpers/test-step-decorator" // added a helper to see the data of failed cases elaborately
import { HelperBase } from "./helper-base";

export class FormLayoutsPage extends HelperBase{
    //As we have extends the helper base, we have to added the 'private readonly page:Page' and 'this.page=page' shouldn't ne written again in main POM pages

    constructor(page:Page){
        super(page) // this should be changed to super(page) from 'this.page=page', if HelperBase is used.
    }

    /**
     * This method submits inline form with User Email , Password and Option as check box
     * @param email - valid email address
     * @param password  - correct password
     * @param optionText - option 1 or Option 2 to be selcted for the check box
     */
    @step
    async submitUsingTheGridForm(email: string, password:string, optionText:string){ //Parameterized Methods in POM
        const usingTheGridForm = this.page.locator('nb-card',{hasText:'Using the Grid'})
        await usingTheGridForm.getByRole('textbox',{name:'Email'}).fill(email)
        await usingTheGridForm.getByRole('textbox',{name:'Password'}).fill(password)
        await usingTheGridForm.getByLabel(optionText).check({force:true})
        await usingTheGridForm.getByRole('button',{name:'Sign in'}).click()

        const toastMessage = await this.getToastrMessage()
        console.log(toastMessage)
    }

    /**
     * This method submits inline form with User Full name , Email and Remember me Checkbox can be selected
     * @param fullname - Valid test user fulld name(First and Last name)
     * @param email - valid test user email
     * @param rememberMeCheckBox - pass 'true' to select Remember me Checkbox
     */
    @step
    async submitGridLine(fullname:string,email:string,rememberMeCheckBox:boolean){
        const submitGridLineForm = this.page.locator('nb-card',{hasText:'Inline form'})
        await submitGridLineForm.getByRole('textbox',{name:'Jane Doe'}).fill(fullname)
        await submitGridLineForm.getByRole('textbox',{name:'Email'}).fill(email)
        if(rememberMeCheckBox){
            await submitGridLineForm.getByRole('checkbox').check({force:true})
        }
        await submitGridLineForm.getByRole('button',{name:'Submit'}).click()

    }

}