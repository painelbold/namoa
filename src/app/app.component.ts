import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Nav, Platform } from 'ionic-angular';

import { AngularFireAuth } from '../../node_modules/angularfire2/auth';
import { TermsOfServicePage } from '../pages/terms-of-service/terms-of-service';
import { TravelTipsPage } from '../pages/travel-tips/travel-tips';
import { LoginPage } from './../pages/login/login';
import { MyProfilePage } from './../pages/my-profile/my-profile';
import { PrivacyPage } from './../pages/privacy/privacy';
import { TravelPlansListPage } from './../pages/travel-plans-list/travel-plans-list';
import { AuthService } from './../providers/auth/auth-service';
import { UserDataProvider } from './../providers/user-data/user-data';
import { TravelPlanPage } from '../pages/plan/travel-plan/travel-plan';
import { AboutPage } from '../pages/about/about';

import { TranslateService } from '@ngx-translate/core';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  loggedUser: any;

  language: any;

  pages: Array<{title: string, component: any, icon: string}> = [];

  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private afAuth: AngularFireAuth,
    private authService: AuthService,
    private udProvider: UserDataProvider,
    translate: TranslateService) {
    this.initializeApp();
    this.loggedUser = { fullName: '' };

    translate.setDefaultLang(localStorage.getItem('idioma') || 'pt');
    translate.use(localStorage.getItem('idioma') || 'pt');

    const authObserver = afAuth.authState.subscribe(user =>{
      if(user){
        localStorage.setItem('loggedUserKey',user.uid)
        this.rootPage = TravelPlansListPage;
        const udObserver = udProvider.getUserData()
                            .subscribe(user =>{
                              if(user){
                                this.loggedUser = user;
                                udObserver.unsubscribe();
                              }
                            });
      }
      else{
        this.rootPage = LoginPage;
      }
    });

    if(localStorage.getItem('idioma')==='pt'){
        this.language = { idioma: "Português", srcImg: "./assets/imgs/languagePT.png" };
    }else if(localStorage.getItem('idioma')==='en'){
        this.language = { idioma: "Inglês", srcImg: "./assets/imgs/languageEN.png" };
    }else if(localStorage.getItem('idioma')==='es'){
        this.language = { idioma: "Espanhol", srcImg: "./assets/imgs/languageES.png" };
    }else if(localStorage.getItem('idioma')==='it'){
        this.language = { idioma: "Italiano", srcImg: "./assets/imgs/languageIT.png" };
    }else if(localStorage.getItem('idioma')==='fr'){
        this.language = { idioma: "Francês", srcImg: "./assets/imgs/languageFR.png" };
    }else if(localStorage.getItem('idioma')==='al'){
        this.language = { idioma: "Alemão", srcImg: "./assets/imgs/languageAL.png" };
    }else{
        this.language = { idioma: "Português", srcImg: "./assets/imgs/languagePT.png" };
    }

    translate.get("MEUS PLANOS").subscribe(value => { 
          this.pages.push({ title: value, component: TravelPlansListPage, icon: 'list-box' });
    });
    translate.get("ADICIONAR PLANO").subscribe(value => { 
          this.pages.push({ title: value, component: TravelPlanPage , icon: 'add-circle' });
    });
    translate.get("MINHA CONTA").subscribe(value => { 
          this.pages.push({ title: value, component: MyProfilePage, icon: 'person'});
    });
    translate.get("DICAS SUSTENTÁVEIS").subscribe(value => { 
          this.pages.push({ title: value, component: TravelTipsPage, icon: 'water'});
    });
    translate.get("TERMOS DE USO").subscribe(value => { 
          this.pages.push({ title: value, component: TermsOfServicePage, icon: 'book' });
    });
    translate.get("POLÍTICA DE PRIVACIDADE").subscribe(value => { 
          this.pages.push({ title: value, component: PrivacyPage, icon: 'information' });
    });
    translate.get("SOBRE O NAMOA").subscribe(value => { 
          this.pages.push({ title: value, component: AboutPage, icon: 'information-circle' });
    });
    // used for an example of ngFor and navigation
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  alterIdioma(idioma){
    localStorage.setItem('idioma',idioma);
    window.location.reload()
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
