import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';

@Pipe({
    name: 'convertTimestamp'
})
export class ConvertTimestampPipe implements PipeTransform {

    transform(value: Timestamp | string): Date {
        switch(typeof(value)) {
            case 'string':
                return new Date(value as string);
            default:
                return value.toDate();
        }
    }

}
