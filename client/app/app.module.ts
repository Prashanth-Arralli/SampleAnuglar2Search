import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { RoutingModule } from './routing.module';
import { SharedModule } from './shared/shared.module';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { AuthGuardLogin } from './services/auth-guard-login.service';
import { AuthGuardAdmin } from './services/auth-guard-admin.service';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { AccountComponent } from './account/account.component';
import { AdminComponent } from './admin/admin.component';
import { NotFoundComponent } from './not-found/not-found.component';

import { HomeComponent } from './home/home.component';
import { SearchBoxComponent } from './search-box/search-box.component';
import { SearchComponent } from './search/search.component';
import { SearchListComponent } from './search-list/search-list.component';
import { SearchFilterComponent } from './search-filter/search-filter.component';
import { SearchPageComponent } from './search-page/search-page.component';
import { SearchPageDetailsComponent } from './search-page-details/search-page-details.component';
import { SearchPageLeftnavComponent } from './search-page-leftnav/search-page-leftnav.component';

import { NgbdTypeaheadBasic } from './typeahead/typeahead-basic';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import {DropdownModule} from "ng2-dropdown";
import { SearchService } from './services/search.service';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    LogoutComponent,
    AccountComponent,
    AdminComponent,
    NotFoundComponent,
    NgbdTypeaheadBasic,
    HomeComponent,
    SearchBoxComponent,
    SearchComponent,
    SearchListComponent,
    SearchFilterComponent,
    SearchPageComponent,
    SearchPageDetailsComponent,
    SearchPageLeftnavComponent
  ],
  imports: [
    RoutingModule,
    SharedModule,
    NgbModule.forRoot(),
    InfiniteScrollModule,
    DropdownModule
  ],
  providers: [
    AuthService,
    AuthGuardLogin,
    AuthGuardAdmin,
    UserService,
    SearchService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})

export class AppModule { }
