import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[cpfMask]',
  standalone: true
})
export class CpfMaskDirective {

  constructor(
    private el: ElementRef,
    private control: NgControl
  ) {}

  @HostListener('input', ['$event'])
  onInput(event: any): void {
    let value = event.target.value;

  // Remove tudo que não for número
  value = value.replace(/\D/g, '');
  value = value.substring(0, 11);

  // Formata
  let formatted = value;
  if (value.length > 3)
    formatted = value.replace(/^(\d{3})(\d)/, '$1.$2');
  if (value.length > 6)
    formatted = formatted.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
  if (value.length > 9)
    formatted = formatted.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');

  // Atualiza input com o valor formatado
  this.el.nativeElement.value = formatted;

  // Atualiza FormControl com valor puro (ou com valor formatado, se preferir)
  this.control.control?.setValue(value, { emitEvent: true }); 
}

}