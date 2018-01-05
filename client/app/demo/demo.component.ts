import { Component, OnInit, NgModule } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { DemoService } from '../services/demo.service';
import { Demo } from '../shared/models/demo.model';

@Component({
  selector: 'app-demo',
  styles: [`
    .search-results {
      height: 100%;
      overflow: scroll;
    }
    .title {
      position: fixed;
      top: 0;
      left: 0;
      background-color: rgba(0,0,0,.5);
      color: white;
      width: 100%;
    }
    .title small {
      color: #eaeaea;
    }
  `],
  templateUrl: './demo.component.html'
})

export class DemoComponent implements OnInit {
  names = [];
  searchList = [];
  startIndex = 0;
  maxLimit = 10;
  previousSearch = '';
  yearFilters = [];
  typeFilters = [];
  categoryFilters = [];
  selectedFilters = [];

  constructor(private demoService: DemoService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.getKeywords();
    this.activatedRoute.queryParams.subscribe((params: Params) => {
        this.key = params['q'];
        this.getResults();

    });
  }

  getKeywords() {
    this.demoService.getKeywords().subscribe(
      res => {
        res.map(item => {
          item.userqueries.map((it) => {
            this.names.push(it);
          });
        });
        this.names = this.names.filter((elem, index, self) => index === self.indexOf(elem));
        console.log(this.names);
      },
      error => console.log(error);
    )
  }

  resetState(key) {
    this.startIndex = 0;
    this.searchList = [];
    if (key) {
      history.replaceState('', '', '/demo/search?q=' + key)
      this.previousSearch = key;
      this.getFilters(key);
    }
  }

  getFilters(key) {
    this.demoService.getFilters(key).subscribe(
      res => {
        let yearFilters = [];
        let typeFilters = [];
        let categoryFilters = [];
        res.map((item) => {
          if (item.year) {
            yearFilters = yearFilters.concat(item.year);
          }
          if (item.doctype) {
            typeFilters = typeFilters.concat(item.doctype);
          }
          if (item.category) {
            categoryFilters = categoryFilters.concat(item.category);
          }
        })
        this.yearFilters = yearFilters.filter((elem, index, self) => index === self.indexOf(elem));
        this.typeFilters = typeFilters.filter((elem, index, self) => index === self.indexOf(elem));
        this.categoryFilters = categoryFilters.filter((elem, index, self) => index === self.indexOf(elem));
        console.log(this.yearFilters);
        console.log(this.typeFilters);
        console.log(this.categoryFilters);

      }
      err => console.log(err);
    )
  }

  applyFiler(value, field) {
    console.log(value);
    console.log(field);
    this.selectedFilters[field] = value;
    this.resetState('');
    this.getResultOnSearch();
  }

  getResultOnSearch() {
    const key = document.getElementById('typeahead-basic').value || this.key;
    if (this.names.indexOf(key) !== -1) {
      this.key = key;
      this.getResults();
    }
  }

  getResults() {
    let key = this.key
    if (key) {
      if (key !== this.previousSearch) {
        this.resetState(key);
        this.selectedFilters = {};
      }
      if (this.searchList.length !== this.maxLimit + this.startIndex) {
        const startIndex = this.startIndex;
        const maxLimit = this.maxLimit;
        const selectedFilters = this.selectedFilters;
        this.demoService.getSearchList(key, startIndex, maxLimit, selectedFilters).subscribe(
          res => {
            res.data.map((item) => {
              item.description = item.description.replace(new RegExp(key, 'g'), `<strong>${key}</strong>`);
            })
            this.searchList = this.searchList.concat(res.data);
          }
          error => console.log(error)
        );
      }
    } else {
      console.log('select a valid one')
    }
  }

  getMore() {
    console.log('fetching more');
    this.startIndex += this.maxLimit;
    this.getResultOnSearch();
  }
}
