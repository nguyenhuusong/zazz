import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import {LicenseManager} from "@ag-grid-enterprise/all-modules";
LicenseManager.setLicenseKey("CompanyName=UNICLOUD TECHNOLOGY GROUP .,JSC,LicensedGroup=UNICLOUD TECHNOLOGY GROUP .,JSC,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=0,AssetReference=AG-023179,ExpiryDate=9_December_2022_[v2]_MTY3MDU0NDAwMDAwMA==114a22b36a8d0e5fcb7da758d74b875c");
if (environment.production) {
  enableProdMode();
}
// var enterprise = require("@ag-grid-enterprise/core");
// enterprise.LicenseManager.setLicenseKey("CompanyName=UNICLOUD TECHNOLOGY GROUP .,JSC,LicensedGroup=UNICLOUD TECHNOLOGY GROUP .,JSC,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=0,AssetReference=AG-023179,ExpiryDate=9_December_2022_[v2]_MTY3MDU0NDAwMDAwMA==114a22b36a8d0e5fcb7da758d74b875c");

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
