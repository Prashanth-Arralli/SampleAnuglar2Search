import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Search } from '../shared/models/search.model';

@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['./search-list.component.css']
})
export class SearchListComponent implements OnInit {
  @Input() searchList: Array<Search>;
  @Input() loading: boolean;
  @Output() showMore: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
    console.log(this.loading)
  }

  getMore() {
    this.showMore.emit('fetch-data');
  }

}
