//typeahead comp and search buttom -used by home and search comp
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import {ToasterService} from 'angular2-toaster';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent implements OnInit {
  @Input() states: Array<string>;
  @Output() searchResult: EventEmitter<string> = new EventEmitter<string>();
  constructor(private router: Router,
              private toasterService: ToasterService) { }

  ngOnInit() {
  }

  //event triggers on Enter from typeahead comp and propagates event to parent
  searchData(key) {
    if (key) {
      this.router.navigateByUrl('/search?q=' + key);
      this.searchResult.emit(key);
    } else {
      this.toasterService.pop("warning","Invalid Search", "Select from dropdown");
    }

  }

  // on Click search button - activte search routes & event neeeded only for seatch page(not home)
  openSearchList() {
    const key = (<HTMLInputElement>document.getElementById('typeahead-basic')).value;
    if (key) {
      this.router.navigateByUrl('/search?q=' + key);
      this.searchResult.emit(key);
    } else {
      this.toasterService.pop("warning","Invalid Search", "Select from dropdown");
    }

  }
}
