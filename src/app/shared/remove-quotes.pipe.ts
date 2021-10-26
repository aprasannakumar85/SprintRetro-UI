import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeQuotes'
})
export class RemoveQuotesPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    return value.replace(/(^"|"$)/g, '');
    //.replace(/-/g, ' ');
  }

}
