import {Component, Input, EventEmitter, Output} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';




@Component({
  selector: 'ngbd-typeahead-basic',
  templateUrl: './typeahead-basic.html',
  styles: [`.form-control { width: 300px; }`]
})
export class NgbdTypeaheadBasic {
  public model: any;
  @Input() states: Array<string>;
  @Output() searchData: EventEmitter<string> = new EventEmitter<string>();

  constructor(private router: Router) { }

  onEnterKey() {
    const key = (<HTMLInputElement>document.getElementById('typeahead-basic')).value;
    
    this.searchData.emit(key);
  }

  search = (text$: Observable<string>) =>
    text$
      .debounceTime(200)
      .distinctUntilChanged()
      .map(term => term.length < 0 ? []
        : this.states.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));

}
