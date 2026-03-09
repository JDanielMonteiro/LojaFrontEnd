import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {ChangeDetectionStrategy, Component, signal, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {merge} from 'rxjs';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';


@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css',
  standalone: true,
  imports: [MatCardModule, MatChipsModule, MatProgressBarModule, MatFormFieldModule, MatInputModule, 
    FormsModule, ReactiveFormsModule, MatButtonModule,MatIconModule, RouterModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cadastro {
    errorMessageCpf = signal(''); 
    errorMessageNome =  signal('');
    form: FormGroup;
    private _snackBar = inject(MatSnackBar);
    errorMessageDataNascimento = signal('');
    errorMessageEmail= signal('');
    hide = signal(true);
    errorMessageSenha = signal('Esta senha não atende aos requisitos mínimos.');
    

  constructor(private fb: FormBuilder) {
      this.form = this.fb.group({
        cpf: ['', [Validators.required, Validators.pattern(/^[0-9.-]*$/), this.validaCpf]],
        nomeCompleto: ['', [Validators.required, this.validaNomeCompleto]],
        nomePublico:  ['', Validators.required],
        dataNascimento: ['', [Validators.required, this.validaDataValida]],
        email: ['', [Validators.required, Validators.email]],
        senha: ['', [Validators.required,Validators.minLength(8), 
          this.validaSenhaMaiuscula, this.validaSenhaMinuscula, 
          this.validaSenhaPossuiCaracterEspecial, this.validaSenhaPossuiNumero
        ]]
      });
    }

  mascaraCpfHtml(){
    let x = document.getElementById("Inputcpf") as HTMLInputElement;
    x?.addEventListener("keypress", () => {
      //console.log(x.value)
      if(this.contemLetra(x.value)){
        x.value = "";
      }
      let tamanho = x.value.length;
      if(tamanho === 3 || tamanho === 7){
        x.value += ".";
      } else if(tamanho === 11){
        x.value += "-";
      }
    
    })
  }

  private contemLetra(texto: string): boolean {
    const regex = /\p{L}/u;
    return regex.test(texto);
  }

  private validaCpf(control: AbstractControl) {
    let cpf = control.value;

    if (!cpf) return null;

    const errors: any = {};

    cpf = cpf.replace(/[^\d]+/g,'');

    
    if(cpf.length !== 11 || /^(\d)\1+$/.test(cpf)){
        errors['erroTamanho'] = true;
    }else{
       delete errors['erroTamanho'];
    }

    let calculoCpfValido = true;
    for (let t = 9; t < 11; t++) {
        let soma = 0;
        for (let i = 0; i < t; i++) {
            soma += parseInt(cpf[i]) * (t + 1 - i);
        }
        let digito = (soma * 10) % 11;
        if (digito === 10 || digito === 11) digito = 0;
        if (digito !== parseInt(cpf[t])) calculoCpfValido = false;
    }
    if(calculoCpfValido == false){
      errors['erroDigitosAleatorios'] = true;
    }else{
       delete errors['erroDigitosAleatorios'];
    }
    return Object.keys(errors).length ? errors : null;
  }
 
  private validaNomeCompleto(control:AbstractControl) {    //Valida se um nome completo é válido. //  Regras: Apenas letras/espaços/hífens, min. 3 caracteres, pelo menos duas palavras.
    var nome =control.value;
    
    if (!nome) return null;

    const errors: any = {};

    const nomeLimpo = nome.trim();      // trim(); serve para quebrar uma string. Ex: nesse caso tá quebrando com espaço, e transformando em uma lista de strings.
    const regex = /^[a-zA-ZÀ-ÿ\s'-]{3,80}$/;   // Regex: Permite letras, espaços, apóstrofos e hífens.

    if(regex.test(nomeLimpo) && nomeLimpo.split(/\s+/).length >= 2){    // Verifica se o regex passa e se há pelo menos um espaço (duas palavras)
      delete errors['nomeInvalido'];
    } else {
        errors['nomeInvalido'] = true;
    }
    
    return Object.keys(errors).length ? errors : null;
  }

 private validaDataValida(control:AbstractControl) {      
    var dataStr = control.value;
    // const errors = control.errors || {};

    if (!dataStr) return null;

    const errors: any = {};

    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(dataStr)){
      errors['DataIncompleta'] = true;
    } else {
      delete errors['DataIncompleta'];
    }

    const [dia, mes, ano] = dataStr.split('/').map(Number);
    const dataObjeto = new Date(ano, mes - 1, dia);
    const dataHoje = new Date();
    // Verifica se o objeto Date corrigiu o valor (ex: 31/02 vira 03/03)

    if(
      dataObjeto.getFullYear() === ano &&
      dataObjeto.getMonth() === mes - 1 &&
      dataObjeto.getDate() === dia &&
      dataObjeto < dataHoje
    ){      
      delete errors['dataInvalida'];
    } else{
      errors['dataInvalida'] = true;   
    }

    return Object.keys(errors).length ? errors : null;
  }

  aplicarMascaraData(event: any) {
    let valor = event.target.value.replace(/\D/g, ''); // Remove tudo que não é número
    if (valor.length > 8) valor = valor.slice(0, 8); // Limita a 8 dígitos
    // Aplica a máscara DD/MM/AAAA
    if (valor.length >= 5) {
      valor = valor.replace(/^(\d{2})(\d{2})(\d{0,4}).*/, '$1/$2/$3');
    } else if (valor.length >= 3) {
      valor = valor.replace(/^(\d{2})(\d{0,2}).*/, '$1/$2');
    }
    
    event.target.value = valor;
  }

  updateErrorMessage() {
    if (this.form.get('cpf')?.hasError('required')) {
      this.errorMessageCpf.set('Campo obrigatório. Informe um CPF válido.');
    } else if(this.form.get('cpf')?.hasError('erroTamanho')){
       this.errorMessageCpf.set('cpf incompleto ou numeros repetidos.');
    } else if(this.form.get('cpf')?.hasError('erroDigitosAleatorios')){
       this.errorMessageCpf.set('Numeros Aleatorios Digitados.');
    }
    else if(!this.form.get('cpf')?.invalid) {
      this.errorMessageCpf.set('');
    }

    //nome completo
    if (this.form.get('nomeCompleto')?.hasError('required')) {
      this.errorMessageNome.set('Campo obrigatório. Informe um Nome válido.');
    } else if(this.form.get('nomeCompleto')?.hasError('nomeInvalido')){
       this.errorMessageNome.set('Nome incompleto.');
    } else if(!this.form.get('nomeCompleto')?.invalid) {
      this.errorMessageNome.set('');
    }

    //data nascimento
    if (this.form.get('dataNascimento')?.hasError('required')) {
      this.errorMessageDataNascimento.set('Campo obrigatório. Informe uma Data válida.');
    } else if(this.form.get('dataNascimento')?.hasError('DataIncompleta')){
       this.errorMessageDataNascimento.set('Data incompleta. Informe uma Data válida.');
    } else if(this.form.get('dataNascimento')?.hasError('dataInvalida')){
       this.errorMessageDataNascimento.set('Data invalida Informe uma Data válida.');
    }else if(!this.form.get('dataNascimento')?.invalid){
      this.errorMessageDataNascimento.set('');
    }

    //email
     if (this.form.get("email")?.hasError('required')) {
      this.errorMessageEmail.set('Campo obrigatório. Informe um e-mail válido.');
    } else if (this.form.get("email")?.hasError('email')) {
      this.errorMessageEmail.set('Não é um email valido');
    } else if(!this.form.get('email')?.invalid){
      this.errorMessageEmail.set('');
    }
  }
 

  private validaSenhaMaiuscula(control: AbstractControl) {
    const value = control.value;
    if (!value) return null;

    const errors: any = {};
    
    if (!/[A-Z]/.test(value)) {
      errors['semLetraMaiuscula'] = true;
    } else {
      delete errors['semLetraMaiuscula'];
    }

    return Object.keys(errors).length ? errors : null;
  }

  private validaSenhaMinuscula(control: AbstractControl) {
    const value = control.value;
    if (!value) return null;

    const errors: any = {};
    if (!/[a-z]/.test(value)) {
      errors['semLetraMinuscula'] = true;
    } else {
      delete errors['semLetraMinuscula'];
    }

    return Object.keys(errors).length ? errors : null;
  }

  private validaSenhaPossuiNumero(control: AbstractControl) {
    const value = control.value;
    if (!value) return null;

    const errors: any = {};
    if (!/\d/.test(value)) {
      errors['semNumero'] = true;
    } else {
      delete errors['semNumero'];
    }

    return Object.keys(errors).length ? errors : null;
  }

  private validaSenhaPossuiCaracterEspecial(control: AbstractControl) {
    const value = control.value;
    if (!value) return null;

    const errors: any = {};
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      errors['semCaracterEspecial'] = true;
    } else {
      delete errors['semCaracterEspecial'];
    }

    return Object.keys(errors).length ? errors : null;
  }  
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  openSnackBar(mensage : string) {
    this._snackBar.open(mensage, 'Fechar', {
      horizontalPosition: "right",  // , é pq é um objeto
      verticalPosition: "top",
      duration: 10 * 1000,

    });
  }

  onSubmit(){
    var formularioPossuiErro = this.form.invalid;   // invalid se o formulario tem algum erro e retorna true ou false // se tiver nenhum erro ele retorna false, se tiver algum erro ele retorna true
    if(formularioPossuiErro == false){
      console.log(this.form.value);
      this.openSnackBar("salvo com sucesso");
    }else {
      console.log("formulario invalido");
      console.log(this.form);
        this.openSnackBar("existem erros no Cadastro");
    }

  }

}
