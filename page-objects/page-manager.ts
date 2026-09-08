import { test, expect, Page } from '@playwright/test';
import { NavigationPage } from '../page-objects/navigation-page';
import { FormLayoutsPage } from '../page-objects/form-layouts-page'
import { Datepickerpage } from '../page-objects/date-picker-page'

//all  the imports from test shoud be present here

export class PageManager{
     readonly navigateTo : NavigationPage
     readonly formLayoutsPage : FormLayoutsPage
     readonly datePickerPage : Datepickerpage

    constructor(page:Page){
        this.navigateTo = new NavigationPage(page)
        this.formLayoutsPage = new FormLayoutsPage(page)
        this.datePickerPage = new Datepickerpage(page)
    }
       

}