export class ValidaCadastroProvider {
  enableStep1: boolean;
  enableStep2: boolean;
  enableStep3: boolean;

  constructor() {
  }

  getEnableStep1(){
    return this.enableStep1;
  }

  getEnableStep2(){
    return this.enableStep2;
  }

  getEnableStep3(){
    return this.enableStep3;
  }
  
  setEnableStep1(state:boolean){
    this.enableStep1 = state;
  }

  setEnableStep2(state: boolean){
    this.enableStep2 = state;
  }

  setEnableStep3(state: boolean){
    this.enableStep3 = state;
  }

}
