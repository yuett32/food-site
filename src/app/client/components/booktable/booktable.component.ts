import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-booktable',
  templateUrl: './booktable.component.html',
  styleUrls: ['./booktable.component.css']
})
export class BooktableComponent {
  @Input() isMain = false
}
