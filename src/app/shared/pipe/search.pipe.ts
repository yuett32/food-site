import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if (!items || !searchText) {
      return items;
    }

    searchText = searchText.toLowerCase();

    return items.filter(item => {
      return (item.productTitle && item.productTitle.toLowerCase().includes(searchText)) ||
             (item.description && item.description.toLowerCase().includes(searchText));
    });
  }

}
