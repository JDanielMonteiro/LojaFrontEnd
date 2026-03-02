import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {ChangeDetectionStrategy, Component, signal, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
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
    

  constructor(private fb: FormBuilder) {
      this.form = this.fb.group({
        cpf: ['', Validators.required],
        nomeCompleto: ['', Validators.required],
        nomePublico:  ['', Validators.required],
        dataNascimento: ['', Validators.required],
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


  contemLetra(texto: string): boolean {
  const regex = /\p{L}/u;
  return regex.test(texto);
  }

  validarCpf() {
    let x = document.getElementById("Inputcpf") as HTMLInputElement;
    var cpf = x.value;
    cpf = cpf.replace(/[^\d]+/g,''); // Remove caracteres não numéricos
      //console.log(cpf);
    // Verifica se tem 11 dígitos ou se é uma sequência de repetidos
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
      this.form.get("cpf")?.setErrors({erroTamanho : true})  // quando é um objeto : sifnifica recebe   
      //console.log(this.form.invalid);
      this.updateErrorMessageCpf();
      this.form.markAsPristine();
      return;
    } else{
        this.form.get("cpf")?.setErrors(null);
    }
       // Cálculo dos dígitos verificadores
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
      this.form.get("cpf")?.setErrors({erroDigitosAleatorios : true})  // quando é um objeto : sifnifica recebe   
      this.updateErrorMessageCpf();
    } else{
        this.form.get("cpf")?.setErrors(null);
    }
    
  }

   updateErrorMessageCpf() {
    if (this.form.get('cpf')?.hasError('required')) {
      this.errorMessageCpf.set('Campo obrigatório. Informe um CPF válido.');
    } else if(this.form.get('cpf')?.hasError('erroTamanho')){
       this.errorMessageCpf.set('cpf incompleto ou numeros repetidos.');
    } else if(this.form.get('cpf')?.hasError('erroDigitosAleatorios')){
       this.errorMessageCpf.set('Numeros Aleatorios Digitados.');
    }
    else {
      this.errorMessageCpf.set('');
    }
  }

  openSnackBar(mensage : string) {
    this._snackBar.open(mensage, 'Fechar', {
      horizontalPosition: "right",  // , é pq é um objeto
      verticalPosition: "top",
      duration: 10 * 1000,

    });
  }

 
  validarNomeCompleto() {    //Valida se um nome completo é válido. //  Regras: Apenas letras/espaços/hífens, min. 3 caracteres, pelo menos duas palavras.
    let x = document.getElementById("InputNome") as HTMLInputElement;
    var nome = x.value;
    if (!nome) return;

    const nomeLimpo = nome.trim();      // trim(); serve para quebrar uma string. Ex: nesse caso tá quebrando com espaço, e transformando em uma lista de strings.

    const regex = /^[a-zA-ZÀ-ÿ\s'-]{3,80}$/;   // Regex: Permite letras, espaços, apóstrofos e hífens.

    if(regex.test(nomeLimpo) && nomeLimpo.split(/\s+/).length >= 2){    // Verifica se o regex passa e se há pelo menos um espaço (duas palavras)
      this.form.get("nomeCompleto")?.setErrors(null);
      //console.log("passou");
    } else {
        this.form.get("nomeCompleto")?.setErrors({nomeInvalido : true})  // quando é um objeto : sifnifica recebe   
        this. updateErrorMessageNome();
        this.form.markAsPristine();
        //console.log("entrou no erro");
        return;
    }
  }

  updateErrorMessageNome() {
    if (this.form.get('nomeCompleto')?.hasError('required')) {
      this.errorMessageNome.set('Campo obrigatório. Informe um Nome válido.');
    } else if(this.form.get('nomeCompleto')?.hasError('nomeInvalido')){
       this.errorMessageNome.set('Nome incompleto.');
    } else {
      this.errorMessageNome.set('');
    }
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

  isDataValida(dataStr: string) {       // dataStr é quem recebe o dado que vem do $event do HTML
    // Valida o formato básico primeiro
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(dataStr)){
      this.form.get("dataNascimento")?.setErrors({DataIncompleta : true});
      this.updateErrorMessageDataNascimento();
      this.form.markAsPristine();
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

      this.form.get("dataNascimento")?.setErrors(null);
      console.log("data valida");
    } else{
      this.form.get("dataNascimento")?.setErrors({dataInvalida : true});
      this.updateErrorMessageDataNascimento();
      this.form.markAsPristine();   // markAsPristine ELE CHAMA O FORMULARIO E MARCA TUDO QUE ESTIVER ERRADO
      
    }
  }

  updateErrorMessageDataNascimento(){
    if (this.form.get('dataNascimento')?.hasError('required')) {
      this.errorMessageDataNascimento.set('Campo obrigatório. Informe uma Data válida.');
    } else if(this.form.get('dataNascimento')?.hasError('DataIncompleta')){
       this.errorMessageDataNascimento.set('Data incompleta. Informe uma Data válida.');
    } else if(this.form.get('dataNascimento')?.hasError('dataInvalida')){
       this.errorMessageDataNascimento.set('Data invalida Informe uma Data válida.');
    }else {
      this.errorMessageDataNascimento.set('');
    }
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
