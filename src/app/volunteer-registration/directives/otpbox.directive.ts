import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[otpbox]'
})
export class OtpboxDirective {
  constructor(private _el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    

    const initalValue = this._el.nativeElement.value;
    if(initalValue > 9)
      this._el.nativeElement.value = initalValue.replace(/[^0-9.]*/g, '') % 10;
    else 
    this._el.nativeElement.value = initalValue.replace(/[^0-9.]*/g, '')
    if (initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
}

}
