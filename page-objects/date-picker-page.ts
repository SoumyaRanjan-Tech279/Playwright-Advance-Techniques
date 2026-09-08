import { Page,expect } from "@playwright/test";
import { step } from "../helpers/test-step-decorator" // added a helper to see the data of failed cases elaborately
import { HelperBase } from "./helper-base";

export class Datepickerpage extends HelperBase{

//As we have extends the helper base, we have to added the 'private readonly page:Page' and 'this.page=page' shouldn't ne written again in main POM pages

    constructor(page:Page){
        super(page) // this should be changed to super(page) from 'this.page=page', if HelperBase is used.
    }

    @step
    async selectCommonDatepickerDateFromToday(daysFromToday:number){
        const calenderInputField = this.page.getByPlaceholder('Form Picker')
        await calenderInputField.click()

       const expectedDate = await this.selectDateInTheCalender(daysFromToday)

        await expect(calenderInputField).toHaveValue(expectedDate)

        await this.getToastrMessage() //To run the helper base message for extened pages

    }

    @step
    async selectDatePickerWithRangeFromToday(daysFromTodayStart: number, daysFromTodayEnd:number){

        const calenderInputField = this.page.getByPlaceholder('Range Picker')
        await calenderInputField.click()

        const expectedDatStart = await this.selectDateInTheCalender(daysFromTodayStart)
        const expectedDatEnd = await this.selectDateInTheCalender(daysFromTodayEnd)
        const expectedRangeDate = `${expectedDatStart} - ${expectedDatEnd}`

        await expect(calenderInputField).toHaveValue(expectedRangeDate)

        await this.getToastrMessage()
    }

    @step
    private async selectDateInTheCalender(daysfromtoday : number){
        const date = new Date();
        date.setDate(date.getDate() + daysfromtoday)
        const expectedDay = date.getDate().toString()
        const expectedMonth = date.toLocaleString('En-US',{month:'short'})
        const expectedMonthLong = date.toLocaleString('En-US',{month:'long'})
        const expectedYear = date.getFullYear()
        const expectedDate = `${expectedMonth} ${expectedDay}, ${expectedYear}`

        let currentMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`
        while(!currentMonthAndYear?.includes(expectedMonthAndYear)){
            await this.page.locator('.next-month').click()
            currentMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        }

        await this.page.locator('.day-cell:not(.bounding-month)').getByText(expectedDay,{exact:true}).click()

        return expectedDate
        await this.getToastrMessage() //To run the helper base message for extened pages
    }

}