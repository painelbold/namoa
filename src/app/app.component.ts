import { AuthService } from './../providers/auth/auth-service';
import { TravelPlansListPage } from './../pages/travel-plans-list/travel-plans-list';

import { PrivacyPage } from './../pages/privacy/privacy';
import { LoginPage } from './../pages/login/login';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TermsOfServicePage } from '../pages/terms-of-service/terms-of-service';
import { AngularFireAuth } from '../../node_modules/angularfire2/auth';
import { TravelPlanPage } from '../pages/travel-plan/travel-plan';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{title: string, component: any, icon: string}>;

  constructor(public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    private afAuth: AngularFireAuth,
    private authService: AuthService) {
    this.initializeApp();

    const authObserver = afAuth.authState.subscribe(user =>{
      if(user){
        localStorage.setItem('loggedUserKey',user.uid)
        this.rootPage = TravelPlansListPage;
        authObserver.unsubscribe();
      }
      else{
        this.rootPage = LoginPage;
      }
    });

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Meus Planos', component: TravelPlansListPage, icon: 'list-box' },
      { title: 'Adicionar Plano', component: TravelPlanPage , icon: 'add-circle' },
      { title: 'Termos de Uso', component: TermsOfServicePage, icon: 'book' },
      { title: 'Política de Privacidade', component: PrivacyPage, icon: 'information-circle' }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  logout(){
    this.authService.signOut()
    .then(()=>{
      this.nav.setRoot(LoginPage);
    }).catch((error)=>{
      console.error(error);
    });
  }
}
