import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  meals: string[] = [];
  page: number = 1;

  constructor() { }

  ngOnInit(): void {
    for (let i = 0; i < 20; i++) {
      this.meals.push('Meal' + Math.floor(Math.random() * 20));
    }
  }

}
