//description : search item details parent - fetching data by ID of item and propagates to details and left nav components

import { Component, OnInit } from '@angular/core';
import { SearchService } from '../services/search.service';
import {ToasterService} from 'angular2-toaster';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit {

  constructor(private searchService: SearchService,
              private toasterService: ToasterService) { }

  name = '';
  description =  '';
  doctype = '';
  sections = [];
  userqueries = [];
  cites = [];
  citedBy = [];

  ngOnInit() {
    const id = window.location.pathname.split('/')[2];
    this.findByDocId(id);
  }

  findByDocId(id) {
    this.searchService.findByDocId(id).subscribe(
      res => {
        this.name = res[0].name;
        this.description = res[0].description;
        this.doctype = res[0].doctype
        //post process based on doctype
        if (this.doctype === 'act') { // act -show sections
          this.sections = [];
          res[0].sections.map((it) => {
            this.sections.push(it);
          })
        } else if (this.doctype === 'section') { //section - show sections and bold active one
          this.sections = [];
          res[0].sections.map((it) => {
            if ( it.indexOf('(Active)') === -1 ) {
              this.sections.push(it);
            } else {
              this.sections.push('<strong>' + it + '</strong>');
            }

          })
        } else { //case - show details
          this.userqueries = res[0].userqueries ? res[0].userqueries: [];
          this.cites = res[0].citation ?[res[0].citation]: [];
          this.citedBy =  res[0].score ? [res[0].score]: [];
        }
      },
      error => {
        console.log(error);
        this.toasterService.pop('error', "error fetching search data", "please try again")
        //window.alert("error fetching search data, please try again")
      }
    )
  }

}
