import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit{
  @Input() isMain = false;
  filter : any = 'all';
  allfoodItem : any = [

    {
    id:0,
    title: 'Delicious Pizza',
    description : ' Veniam debitis quaerat officiis quasi cupiditate quo, quisquam velit, magnam voluptatem repellendus sed eaque.',
    price: '20',
    img: 'assets/f1.png',
    categories: 'pizza'
    },
    {
    id:0,
    title: 'Delicious Burger',
    description : ' Veniam debitis quaerat officiis quasi cupiditate quo, quisquam velit, magnam voluptatem repellendus sed eaque.',
    price: '15',
    img: 'assets/f2.png',
    categories: 'burger'
    },
    {
    id:0,
    title: 'Delicious Burger',
    description : ' Veniam debitis quaerat officiis quasi cupiditate quo, quisquam velit, magnam voluptatem repellendus sed eaque.',
    price: '15',
    img: 'assets/f8.png',
    categories: 'burger'
    },
    {
    id:0,
    title: 'Delicious Burger',
    description : ' Veniam debitis quaerat officiis quasi cupiditate quo, quisquam velit, magnam voluptatem repellendus sed eaque.',
    price: '15',
    img: 'assets/f7.png',
    categories: 'burger'
    },
    {
    id:0,
    title: 'Delicious Pizza',
    description : ' Veniam debitis quaerat officiis quasi cupiditate quo, quisquam velit, magnam voluptatem repellendus sed eaque.',
    price: '20',
    img: 'assets/f3.png',
    categories: 'pizza'
    },
    {
    id:0,
    title: 'Delicious Pasta',
    description : ' Veniam debitis quaerat officiis quasi cupiditate quo, quisquam velit, magnam voluptatem repellendus sed eaque.',
    price: '20',
    img: 'assets/f4.png',
    categories: 'pasta'
    },
    {
    id:0,
    title: 'French Fries',
    description : ' Veniam debitis quaerat officiis quasi cupiditate quo, quisquam velit, magnam voluptatem repellendus sed eaque.',
    price: '20',
    img: 'assets/f5.png',
    categories: 'fries'
    },
    {
    id:0,
    title: 'Delicious Pasta',
    description : ' Veniam debitis quaerat officiis quasi cupiditate quo, quisquam velit, magnam voluptatem repellendus sed eaque.',
    price: '20',
    img: 'assets/f6.png',
    categories: 'pasta'
    },
    {
    id:0,
    title: 'Delicious Pasta',
    description : ' Veniam debitis quaerat officiis quasi cupiditate quo, quisquam velit, magnam voluptatem repellendus sed eaque.',
    price: '20',
    img: 'assets/f9.png',
    categories: 'pasta'
    },
  ]
  foodItem:any = []
  constructor() {}
  ngOnInit(): void {
    this.foodItem = this.allfoodItem;
  }
  filterItem(){
    this.foodItem = this.allfoodItem.filter((item:any) => item.categories == this.filter)
  }
}
