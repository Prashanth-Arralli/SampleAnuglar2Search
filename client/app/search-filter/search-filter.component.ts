import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.css']
})
export class SearchFilterComponent implements OnInit {

  @Input() yearFilters: Array<object>;
  @Input() typeFilters: Array<object>;
  @Output() applyFilter: EventEmitter<object> = new EventEmitter<object>();

  constructor() { }

  ngOnInit() {
  }
  addFilter(value, field) {
    this.applyFilter.emit({value, field});
  }

}
