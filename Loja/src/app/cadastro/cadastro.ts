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
    form: FormGroup;
    private _snackBar = inject(MatSnackBar);

  constructor(private fb: FormBuilder) {
      this.form = this.fb.group({
        cpf: ['', Validators.required],
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
      console.log(cpf);
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

    onSubmit(){
      this.validarCpf();
      var formularioPossuiErro = this.form.invalid;   // invalid se o formulario tem algum erro e retorna true ou false // se tiver nenhum erro ele retorna false, se tiver algum erro ele retorna true
      if(formularioPossuiErro == false){
        this.openSnackBar("salvo com sucesso");
      }else {
        console.log("formulario invalido");
        console.log(this.form);
         this.openSnackBar("existem erros no Cadastro");
      }

    }

}
