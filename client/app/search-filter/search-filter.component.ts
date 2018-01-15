import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.css']
})
export class SearchFilterComponent implements OnInit {

  @Input() yearFilters: Array<object>;
  @Input() typeFilters: Array<object>;
  @Input() userQueries: Array<string>;
  @Output() applyFilter: EventEmitter<object> = new EventEmitter<object>();

  constructor(private router: Router) { }

  ngOnInit() {
  }

  addFilter(value, field) {
    this.applyFilter.emit({value, field});
  }

  searchSelectedQuery(query) {
    this.router.navigateByUrl('/search?q=' + query);
  }

}
