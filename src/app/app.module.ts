import { TravelPlanDetailPageModule } from './../pages/travel-plan-detail/travel-plan-detail.module';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { AngularFireModule } from '../../node_modules/angularfire2';
import { AngularFireAuthModule } from '../../node_modules/angularfire2/auth';
import { AngularFireDatabaseModule } from '../../node_modules/angularfire2/database';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { MyProfilePage } from '../pages/my-profile/my-profile';
import { PlanStep1Page } from '../pages/plan/plan-step1/plan-step1';
import { PlanStep1PageModule } from '../pages/plan/plan-step1/plan-step1.module';
import { PlanStep2Page } from '../pages/plan/plan-step2/plan-step2';
import { PlanStep2PageModule } from '../pages/plan/plan-step2/plan-step2.module';
import { PlanStep3Page } from '../pages/plan/plan-step3/plan-step3';
import { PlanStep3PageModule } from '../pages/plan/plan-step3/plan-step3.module';
import { TravelPlanPage } from '../pages/plan/travel-plan/travel-plan';
import { TravelPlanPageModule } from '../pages/plan/travel-plan/travel-plan.module';
import { PrivacyPage } from '../pages/privacy/privacy';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { TravelPlansListPage } from '../pages/travel-plans-list/travel-plans-list';
import { AuthService } from '../providers/auth/auth-service';
import { TravelPlanTradesProvider } from '../providers/travel-plan-trades/travel-plan-trades';
import { TravelPlanProvider } from '../providers/travel-plan/travel-plan';
import { UserDataProvider } from '../providers/user-data/user-data';
import { ValidaCadastroProvider } from '../providers/valida-cadastro/valida-cadastro';
import { LoginPageModule } from './../pages/login/login.module';
import { MyProfilePageModule } from './../pages/my-profile/my-profile.module';
import { PrivacyPageModule } from './../pages/privacy/privacy.module';
import { RegisterPage } from './../pages/register/register';
import { RegisterPageModule } from './../pages/register/register.module';
import { ResetPasswordPageModule } from './../pages/reset-password/reset-password.module';
import { TermsOfServicePage } from './../pages/terms-of-service/terms-of-service';
import { TermsOfServicePageModule } from './../pages/terms-of-service/terms-of-service.module';
import { TravelPlansListPageModule } from './../pages/travel-plans-list/travel-plans-list.module';
import { TravelTipsPage } from './../pages/travel-tips/travel-tips';
import { TravelTipsPageModule } from './../pages/travel-tips/travel-tips.module';
import { MyApp } from './app.component';
import { TravelPlanDetailPage } from '../pages/travel-plan-detail/travel-plan-detail';
import { AboutPage } from '../pages/about/about';
import { AboutPageModule } from '../pages/about/about.module';

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
    TravelTipsPageModule,
    TravelPlanDetailPageModule,
    AboutPageModule
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
    TravelTipsPage,
    TravelPlanDetailPage,
    AboutPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserDataProvider,
    TravelPlanProvider,
    ValidaCadastroProvider,
    TravelPlanTradesProvider
  ]
})
export class AppModule {}
