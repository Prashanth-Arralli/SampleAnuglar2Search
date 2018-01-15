import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-search-page-details',
  templateUrl: './search-page-details.component.html',
  styleUrls: ['./search-page-details.component.css']
})
export class SearchPageDetailsComponent implements OnInit {
  @Input() name: string;
  @Input() description: string;
  @Input() doctype: string;
  @Input() sections: Array<object>;
  @Input() noLeftnav: boolean;

  constructor() { }

  ngOnInit() {
  }

}
