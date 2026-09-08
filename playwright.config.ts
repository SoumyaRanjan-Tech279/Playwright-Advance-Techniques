import { defineConfig, devices } from '@playwright/test';

//Anything not under use setting are global settings

import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, process.env.TEST_ENV ? `.env.${process.env.TEST_ENV}` : '.env') });

export default defineConfig({
  testDir: './tests',

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0, // Retries to use for number of try and works from CLI commands

  workers: process.env.CI ? 1 : undefined,

  reporter: 'html',

  outputDir: 'test-results',

  use: { // use setting

    baseURL: process.env.URL,

    screenshot: 'on',

    trace: 'on-first-retry',
    video: 'off',  // it will work if run only from CLI Command
  },

  globalSetup: require.resolve('./global-setup.ts'),
  globalTeardown: require.resolve('./global-teardown.ts'),


  projects: [
    {
      name: 'chromium', // Global setting
      use: { ...devices['Desktop Chrome'] }, // use setting
    },
    {
      name: 'mobile-test', //Mobile testing in web browser 
      use: { ...devices['iPhone 17 Pro Max'] }, // use setting
    },


    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'setup', testMatch: /.*\.setup\.ts/
    },
    {
      name: 'teardown', testMatch: /.*\.teardown\.ts/
    },

    {
      name: 'smoke-test',
      testMatch: '6smoke_Project_Setupand_Teardown.spec.ts',
      teardown: 'teardown'
    },

    {
      name: 'regression',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup', 'smoke-test'],
    },



  ],


});
