const scraperObject = {
    url: "https://mocky.atomicfi.com/",
    scraper: async function (browser) {
        const page = await browser.newPage();

        // Go to login page
        await page.goto(this.url);
        console.log(`Navigating to ${this.url}..`);

        // Wait for the required DOM to be rendered
        await page.waitForSelector(".form-group");

        // Set Username and password(can be empty)
        await page.type("#username", "test-good");

        //await page.type("#password", "123");
        
        // Click Sign in button
        await page.click("#authenticate");

        // Wait for the profile page to be rendered
        await page.waitForSelector(".section");

        //Get Accounts info
        const accountsData = await page.$$eval(".account-data", tds => tds.map(td => {
            return td.innerText.replace("\n", " ");
        }));

        // Output Accounts info to console
        console.log("Accounts info:", accountsData);
        accountsData.map

        //Get data
        async function getTableData(headerSelector, valueSelector, objectProcessFunction) {
            const getHeaders = await page.$x(headerSelector);
            const getValues = await page.$x(valueSelector);

            let resultObject = {};
            for (let i = 0; i < getHeaders.length; i++) {
                const header = await page.evaluate(item => item.innerText, getHeaders[i]);
                const value = await page.evaluate(item => item.innerText, getValues[i]);
                //result.push(textProcessFunction(header, value));//reneme to object processing 
                resultObject[header] = value;
                //resultObject.objectProcessFunction(header, value);
            }
            return resultObject;
        }

        //Get Income data 
        const incomeData = await getTableData(
            ".//*[text() = 'Income']/following::table[1]//td",
            ".//*[text() = 'Income']/following::table[1]//th",
            function (header, value) {
                return {[header]: value};
            }
        );
        /*let incomeDataObject = {};
        incomeData.forEach(function(item){
            incomeDataObject = {...incomeDataObject, ...item};
        });*/
        // Output Income data to console
        console.log("Income data:", incomeData);


        //Get Profile data
        const profileData = await getTableData(
            ".//*[text() = 'Profile']/following::table[1]//td",
            ".//*[text() = 'Profile']/following::table[1]//th",
            function (header, value) {
                let clearvalue = value.replace("\n", " ");//check please
                return ({[header]: clearvalue});//.replace("\n", " ");
            }
        );

        /*let profileDataObject = {};
        profileData.forEach(function(item){
            profileDataObject = {...profileDataObject, ...item}
        });*/
        
        // Output Profile data to console
        console.log("Profile data:", profileData);

        //Get Payroll activity data 
        const payrollData = await getTableData(
            ".//td[@class='font-weight-bold']",
            ".//td[@class='font-weight-bold']/following-sibling::td[1]",
            function (header, value) {
                let header1 = "Paydate - " + header;
                let value1 = "Check Amount - " + value; //check please

                return {[header1]: value1};
            }
        );
/*
        let payrollDataObject = {};
        payrollData.forEach(function(item){
            payrollDataObject = {...payrollDataObject, ...item}
        });
*/
        // Output Payroll activity data to console
        console.log("Payroll activity data:", payrollData);
        
    }
}

module.exports = scraperObject;
