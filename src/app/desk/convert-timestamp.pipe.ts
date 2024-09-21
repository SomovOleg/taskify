import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';

@Pipe({
  name: 'convertTimestamp'
})
export class ConvertTimestampPipe implements PipeTransform {

  transform(value: Timestamp): Date {
    return value.toDate();
  }

}
