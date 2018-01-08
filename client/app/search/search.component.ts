//Description - search list page(filters) - fetches all data here and propagates relevant data to children

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
              private activatedRoute: ActivatedRoute,
            private router: Router) { }

  ngOnInit() {
    //fetch keywords and set keyword from URL
    this.getKeywords();
    this.activatedRoute.queryParams.subscribe((params: Params) => {
        this.key = params['q'];
    });
  }

  //fetch Results on Enter - typeahead comp - listens to event
  searchResult(key) {
    this.key = key;
    this.getResults();
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
        if (this.key && this.keywords.indexOf(this.key) !== -1) {
          this.getResults();
        } else {
          this.router.navigateByUrl('/');
        }
      },
      error => console.log(error)
    )
  }

  //on select checkbox - event bind
  applyFilter(params) {
    if (this[params.field].indexOf(params.value) === -1){
      this[params.field].push(params.value);
    } else {
      this[params.field].splice(this[params.field].indexOf(params.value), 1);
    }
    this.resetState('');
    this.getResultOnSearch();
  }

  // reset after change in keyword or applying filters
  resetState(key) {
    this.startIndex = 1;
    this.searchList = [];
    if (key) {
      this.previousSearch = key;
      this.getFilters(key);
    }
  }

  //fetch results on click- search button
  getResultOnSearch() {
    const key = document.getElementById('typeahead-basic').innerHTML || this.key;
    if (this.keywords.indexOf(key) !== -1) {
      this.key = key;
      this.getResults();
    }
  }

  //fetch filters relevant to keyword entered
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
      //if key is different than previous fetch - reset filters & data
      if (key !== this.previousSearch) {
        this.resetState(key);
        this.years = [];
        this.doctypes = [];
      }
      //check if data equals total db count - applicable on fetch more
      if (this.startIndex === 1 || this.searchList.length !== this.total) {
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
            //calculate time taken for db call
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

  // showMore - event triggers in search-list-component on scrolling down the window
  showMore() {
    if (!this.loading) {
      this.startIndex++;
      this.getResultOnSearch();
    }
  }

}
