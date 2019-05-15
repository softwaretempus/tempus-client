import { AbstractControl } from '@angular/forms';

export function CPFValidator(control: AbstractControl) {
    var sum;
    var rest;
    sum = 0;
    if (control.value == "00000000000") return null;

    for (var i = 1; i <= 9; i++)
        sum = sum + parseInt(control.value.substring(i - 1, i)) * (11 - i);

    rest = (sum * 10) % 11;

    if ((rest == 10) || (rest == 11))
        rest = 0;

    if (rest != parseInt(control.value.substring(9, 10)))
        return false;

    sum = 0;

    for (i = 1; i <= 10; i++)
        sum = sum + parseInt(control.value.substring(i - 1, i)) * (12 - i);

    rest = (sum * 10) % 11;

    if ((rest == 10) || (rest == 11))
        rest = 0;

    if (rest != parseInt(control.value.substring(10, 11)))
        return false;

    return true;
    
}