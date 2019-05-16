import { AbstractControl } from '@angular/forms';

export function CPFValidator(control: AbstractControl) {
    if (control.value) {        
        let str = control.value.replace('.', '').replace('-', '').replace('/', '').replace('.', '')
        console.log(str)
        var sum;
        var rest;
        sum = 0;
        if (str == "00000000000")
            return null;

        for (var i = 1; i <= 9; i++)
            sum = sum + parseInt(str.substring(i - 1, i)) * (11 - i);

        rest = (sum * 10) % 11;

        if ((rest == 10) || (rest == 11))
            rest = 0;

        if (rest != parseInt(str.substring(9, 10)))
            return null;

        sum = 0;

        for (i = 1; i <= 10; i++)
            sum = sum + parseInt(str.substring(i - 1, i)) * (12 - i);

        rest = (sum * 10) % 11;

        if ((rest == 10) || (rest == 11))
            rest = 0;

        if (rest != parseInt(str.substring(10, 11)))
            return null;

        return true;
    }
}