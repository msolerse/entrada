import { DOCUMENT } from '@angular/common';
import { Component, OnInit, Input,  Inject } from '@angular/core';
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
    private credentials: CredentialsService,
    @Inject(DOCUMENT) private document: any
  ) { 
    this.createForm();
  }

  elem;

    
  ngOnInit() {
    this.elem = document.documentElement;
    this.service.logout();
   
  }

  openFullscreen() {
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullScreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullScreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullScreen();
    }
  }

  redirect(){
   // this.alert.sendAlert('Entrada correcta', AlertType.Success);
    let redirect = this.service.redirectUrl ? this.service.redirectUrl : '';
    this.router.navigate([redirect]);
  }
  onSubmit() {
    this.login = this.prepareLogin();
    this.service.login(this.login).subscribe(() => {
      if(this.service.isLoggedIn) {
        this.credentials.user = this.usuari;
        this.credentials.password = this.contrasenya;
        //this.alert.sendAlert('Entrada correcta', AlertType.Success);
        let redirect = this.service.redirectUrl ? this.service.redirectUrl : '';
        this.openFullscreen();
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
