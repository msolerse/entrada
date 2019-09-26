import { Component, OnInit, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { SapService } from '../_services/sap.service';
import { LoginViewModel } from '../_entities/LoginViewModel';
import { AlertService } from '../_services/alert.service';
import { AlertType } from '../_entities/Alert';
//import * as jsencrypt from 'jsencrypt';
import { CredentialsService } from '../_services/credentials.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @Input() login: LoginViewModel;

  loginForm: FormGroup;

  usuari: string = "";
  contrasenya: string = "";
  hide = true;

  constructor(
    private service: SapService,
    private router: Router,
    private fb: FormBuilder,
    private alert: AlertService,
    private credentials: CredentialsService
  ) { 
    this.createForm();
  }

  ngOnInit() {
    this.service.logout();
   
  }

  redirect(){
    this.alert.sendAlert('Entrada correcta', AlertType.Success);
    let redirect = this.service.redirectUrl ? this.service.redirectUrl : '';
    this.router.navigate([redirect]);
  }
  onSubmit() {
    this.login = this.prepareLogin();
    this.service.login(this.login).subscribe(() => {
      if(this.service.isLoggedIn) {
        this.credentials.user = this.usuari;
        this.credentials.password = this.contrasenya;
        this.alert.sendAlert('Entrada correcta', AlertType.Success);
        let redirect = this.service.redirectUrl ? this.service.redirectUrl : '';
        this.router.navigate([redirect]);
      }
      else{
        //this.alert.sendAlert('Usuario o contraseña inválidos', AlertType.Error);
        this.alert.sendAlert(this.service.mensaje, AlertType.Error);
      }
    });
    /*
    this.login = this.prepareLogin();
    this.service.auth().subscribe(res => {
      if(this.service.isLoggedIn) {
        this.redirect();
      }
      else{
        let info = JSON.parse(res.body)
        let token: string;
        let apiKey: string;
        let encrypt = new jsencrypt.JSEncrypt();
        encrypt.setPublicKey(info.publicKey);
        let encrypted = encrypt.encrypt(JSON.stringify({ "user": this.usuari, "password": this.contrasenya }));

        //Desem el token
        token = info.token
        //Iterem l'appId
        apiKey = this.service.md5(token);
        this.service.login(this.login, encrypted, apiKey).subscribe(res => {
          //this.credentials.user = this.usuari;
          //this.credentials.password = this.contrasenya;
          this.credentials.user = "2156"
          this.credentials.password = "jenifer10"
          this.redirect();
        });
      }
    });
    */
  }

  createForm() {
    this.loginForm = this.fb.group({
      user: '',
      password: ''
    })
  }

  prepareLogin(): LoginViewModel {
    const formModel = this.loginForm.value;
    const sendLogin: LoginViewModel = {
      user: formModel.user as string,
      password: formModel.password as string
    }
    return sendLogin;
  }

}
