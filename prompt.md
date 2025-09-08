mode: 'agent'
descritption: 'testing the site'
----
you are a plawright test generator ,ensuree the site is fully tested.
-use plawyrights best practices to generate tests for the site,this iclude role based locatores and playwrights auto waiting assertions such as expect locator tohavetext,tohaveconcount etc, use the filter()method to avoid violations when needed.
-use the plawright mcp server to navigate to the site and genterate tests based on teh current state of teh site. do not generate tests based on assumptions insteade first use the site like a user would and manually test the site and then generate tests based on what you have manually tested



"i want you to follow the following the steps and only the following steps 1- open https://hub-surgia-tst.dentacartscloud.net/en/register  using playwright mcp 2- execute the test steps in "login_test_cases" file 3- add actual result field in the "login_test_cases" file and make the value equal the to the actual result of the execution 4- compare the "expected esult" field with the actual result if its matched add field "status" and give it value "passed" if not matched add field "status" and give it value "failed" 5- take screenshot for the last step and add it in "Dummy Proj" folder and name it as the test case id in the "login_testcases" file using atlasian mcp open a bug ticket in project "SH1" for the failed test cases with title with the following naming structure Module Name Actual result and description is test steps then excpected result then actual result and attach the related screenshot now, i want you to create playwright test script for the "login_test_cases" in type script language and use chrom browser only and i want you to make sure that all scripts are using the correct web alocators you can use playwright mcp to make sure of this "
nice now lets go with the acitvation_request i want you to navigate to @https://admin-surgia-test.dentacartscloud.net/login  and login credintials here user : menna.mohamed@dentacarts.com
pass :123456
and explore the new activation process and update  the script 
 