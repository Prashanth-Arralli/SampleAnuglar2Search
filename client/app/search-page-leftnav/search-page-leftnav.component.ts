import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-search-page-leftnav',
  templateUrl: './search-page-leftnav.component.html',
  styleUrls: ['./search-page-leftnav.component.css']
})
export class SearchPageLeftnavComponent implements OnInit {
  @Input() doctype: string;
  @Input() sections: Array<string>;
  @Input() userqueries: Array<string>;
  @Input() cites: Array<string>;
  @Input() citedBy: Array<string>;

  constructor() { }

  ngOnInit() {
  }

}
