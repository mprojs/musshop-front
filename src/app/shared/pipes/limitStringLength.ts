import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'limitStringLength' })
export class LimitStringLengthPipe implements PipeTransform {
  transform(value: string, length: number) {
    if (!value) {
      return '';
    } else {
      return value.substr(0, length) + (value.length > length ? '...' : '');
    }
  }
}
