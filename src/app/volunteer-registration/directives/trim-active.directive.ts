import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Directive({
  selector: '[trimActive]'
})
export class TrimActiveDirective {

  @Input() form: FormGroup;
  constructor(private _el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event) {

      const initalValue = this._el.nativeElement.value;
      if(initalValue.trim() == ""){
      if(this.form) {
        this.form.controls[this._el.nativeElement.name].setValue("")
      }
      this._el.nativeElement.value = initalValue.trim();
      if (initalValue !== this._el.nativeElement.value) {
        event.stopPropagation();
      }
    }
  }

}
