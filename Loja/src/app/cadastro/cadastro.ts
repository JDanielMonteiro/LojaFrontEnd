
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {merge} from 'rxjs';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CpfMaskDirective } from '../util/cpfMask';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css',
  standalone: true,
  imports: [MatCardModule, MatChipsModule, MatProgressBarModule, MatFormFieldModule, MatInputModule, 
    FormsModule, ReactiveFormsModule, MatButtonModule,MatIconModule, RouterModule, CpfMaskDirective, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cadastro {
    errorMessageCpf = signal(''); 
    
    form: FormGroup;

  constructor(private fb: FormBuilder) {
      this.form = this.fb.group({
        cpf: ['', Validators.required],
      });
    }

   updateErrorMessageCpf() {
    if (this.form.get('cpf')?.hasError('required')) {
      this.errorMessageCpf.set('Campo obrigatório. Informe um CPF válido.');
    } else {
      this.errorMessageCpf.set('');
    }
  }

    onSubmit(){
      
    }

}
