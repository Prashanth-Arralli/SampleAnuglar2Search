import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent implements OnInit {
  @Input() states: Array<string>;
  constructor(private router: Router) { }

  ngOnInit() {
  }
  openSearchList() {
    const key = (<HTMLInputElement>document.getElementById('typeahead-basic')).value;
    this.router.navigateByUrl('/home/search?q=' + key);
  }
}
