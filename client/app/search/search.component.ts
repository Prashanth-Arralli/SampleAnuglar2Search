import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  keywords = [];
  searchList = [];
  startIndex = 1;
  maxLimit = 10;
  previousSearch = '';
  yearFilters = [];
  typeFilters = [];
  categoryFilters = [];
  years = [];
  doctypes = [];
  key = '';
  loading = false;
  total = 0;
  timeTaken = 0;


  constructor(private searchService: SearchService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.getKeywords();
    this.activatedRoute.queryParams.subscribe((params: Params) => {
        this.key = params['q'];
        this.getResults();

    });
  }

  getKeywords() {
    this.searchService.getKeywords().subscribe(
      res => {
        res.map(item => {
          item.userqueries.map((it) => {
            this.keywords.push(it);
          });
        });
        this.keywords = this.keywords.filter((elem, index, self) => index === self.indexOf(elem));
        console.log(this.keywords);
      },
      error => console.log(error)
    )
  }


  applyFilter(params) {
    if (this[params.field].indexOf(params.value) === -1){
      this[params.field].push(params.value);
    } else {
      this[params.field].splice(this[params.field].indexOf(params.value), 1);
    }
    this.resetState('');
    this.getResultOnSearch();
  }

  resetState(key) {
    this.startIndex = 1;
    this.searchList = [];
    if (key) {
      this.previousSearch = key;
      this.getFilters(key);
    }
  }

  getResultOnSearch() {
    const key = document.getElementById('typeahead-basic').innerHTML || this.key;
    if (this.keywords.indexOf(key) !== -1) {
      this.key = key;
      this.getResults();
    }
  }

  getFilters(key) {
    this.searchService.getFilters(key).subscribe(
      res => {
        let yearFilters = [];
        let typeFilters = [];
        res.map((item) => {
          if (item.year) {
            yearFilters = yearFilters.concat(item.year);
          }
          if (item.doctype) {
            typeFilters = typeFilters.concat(item.doctype);
          }
        })
        yearFilters = yearFilters.filter((elem, index, self) => index === self.indexOf(elem));
        typeFilters = typeFilters.filter((elem, index, self) => index === self.indexOf(elem));

        this.yearFilters = yearFilters.map((it) => {
          return { name: it, value: false }
        })

        this.typeFilters = typeFilters.map((it) => {
          return { name: it, value: false }
        })

      },
      err => console.log(err)
    )
  }

  getResults() {
    let key = this.key
    if (key) {
      if (key !== this.previousSearch) {
        this.resetState(key);
        this.years = [];
        this.doctypes = [];
      }
      if (this.searchList.length !== this.maxLimit + this.startIndex) {
        const startIndex = this.startIndex;
        const maxLimit = this.maxLimit;
        const years = this.years;
        const doctypes = this.doctypes
        const start = new Date().getTime();
        this.loading = true;
        console.log(this.loading);
        this.searchService.getSearchList(key, startIndex, maxLimit, years, doctypes).subscribe(
          res => {
            res.data.map((item) => {
              let keys = key.split(" ");
              keys.map((it) => {
                item.description = item.description.replace(new RegExp(it, 'g'), `<strong>${it}</strong>`);
              })
            })
            this.total = res.total;
            this.searchList = this.searchList.concat(res.data);
            const end = new Date().getTime();
            this.timeTaken = (end - start) / 1000;
            this.loading = false;
          },
          error => {
            console.log(error);
            this.loading = false;
          }
        );
      }
    } else {
      console.log('select a valid one')
    }
  }

  showMore() {
    if (!this.loading) {
      this.startIndex++;
      this.getResultOnSearch();
    }
  }

}
