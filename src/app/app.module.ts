import { TravelTipsPageModule } from './../pages/travel-tips/travel-tips.module';
import { TravelTipsPage } from './../pages/travel-tips/travel-tips';
import { MyProfilePageModule } from './../pages/my-profile/my-profile.module';
import { PlanStep3PageModule } from './../pages/plan-step3/plan-step3.module';
import { PlanStep2PageModule } from './../pages/plan-step2/plan-step2.module';
import { PlanStep1PageModule } from './../pages/plan-step1/plan-step1.module';
import { TravelPlanPageModule } from './../pages/travel-plan/travel-plan.module';
import { TermsOfServicePageModule } from './../pages/terms-of-service/terms-of-service.module';
import { PrivacyPageModule } from './../pages/privacy/privacy.module';
import { TravelPlansListPageModule } from './../pages/travel-plans-list/travel-plans-list.module';
import { RegisterPageModule } from './../pages/register/register.module';
import { ResetPasswordPageModule } from './../pages/reset-password/reset-password.module';
import { LoginPageModule } from './../pages/login/login.module';
import { PlanStep2Page } from './../pages/plan-step2/plan-step2';
import { PlanStep1Page } from './../pages/plan-step1/plan-step1';
import { TravelPlanPage } from './../pages/travel-plan/travel-plan';
import { TermsOfServicePage } from './../pages/terms-of-service/terms-of-service';
import { RegisterPage } from './../pages/register/register';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthService } from '../providers/auth/auth-service';
import { LoginPage } from '../pages/login/login';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { AngularFireModule } from '../../node_modules/angularfire2';
import { AngularFireAuthModule } from '../../node_modules/angularfire2/auth';
import { AngularFireDatabaseModule } from '../../node_modules/angularfire2/database';
import { UserDataProvider } from '../providers/user-data/user-data';
import { TravelPlansListPage } from '../pages/travel-plans-list/travel-plans-list';
import { TravelPlanProvider } from '../providers/travel-plan/travel-plan';
import { PrivacyPage } from '../pages/privacy/privacy';
import { ValidaCadastroProvider } from '../providers/valida-cadastro/valida-cadastro';
import { PlanStep3Page } from '../pages/plan-step3/plan-step3';
import { MyProfilePage } from '../pages/my-profile/my-profile';

export const firebaseConfig = {
  apiKey: "AIzaSyBFfhTAKdhYWSJQC_3DypjKKSG7umW6DEs",
  authDomain: "namoa-56722.firebaseapp.com",
  databaseURL: "https://namoa-56722.firebaseio.com",
  projectId: "namoa-56722",
  storageBucket: "namoa-56722.appspot.com",
  messagingSenderId: "472445632561"
};


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    LoginPageModule,
    ResetPasswordPageModule,
    RegisterPageModule,
    TravelPlansListPageModule,
    PrivacyPageModule,
    TermsOfServicePageModule,
    TravelPlanPageModule,
    PlanStep1PageModule,
    PlanStep2PageModule,
    PlanStep3PageModule,
    MyProfilePageModule,
    TravelTipsPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    ResetPasswordPage,
    RegisterPage,
    TravelPlansListPage,
    PrivacyPage,
    TermsOfServicePage,
    TravelPlanPage,
    PlanStep1Page,
    PlanStep2Page,
    PlanStep3Page,
    MyProfilePage,
    TravelTipsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserDataProvider,
    TravelPlanProvider,
    ValidaCadastroProvider
  ]
})
export class AppModule {}
