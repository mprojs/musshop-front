import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'toClassName' })
export class ToClassPipe implements PipeTransform {
  transform(value: any) {
    if (!value) {
      return '';
    } else {
      return value.replace(/\s/g, '-').toLowerCase();
    }
  }
}
