//description : search item details parent - fetching data by ID of item and propagates to details and left nav components

import { Component, OnInit } from '@angular/core';
import { SearchService } from '../services/search.service';
import {Router, Params, NavigationStart} from '@angular/router';
import {ToasterService} from 'angular2-toaster';
import { Title }     from '@angular/platform-browser';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit {

  constructor(private searchService: SearchService,
              private router: Router,
              private toasterService: ToasterService,
              private titleService: Title) { }

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
    this.router.events.subscribe((event: NavigationStart) => {
      if (event.url && event.url.split('/')[2]) {
        this.refresh(decodeURI(event.url.split('/')[2]));
      }
    });
  }

  refresh(id) {
    this.findByDocId(id);
  }

  findByDocId(id) {
    this.searchService.findByDocId(id).subscribe(
      res => {
        this.name = res.data[0].name;
        this.titleService.setTitle( this.name );
        this.description = res.data[0].description;
        this.doctype = res.type
        //post process based on doctype
        if (this.doctype === 'acts') { // act -show sections
          this.sections = res.meta;
        } else if (this.doctype === 'section') { //section - show sections and bold active one
          this.sections = [];
          res.meta.map((it) => {
            if ( it.name.indexOf('(Active)') !== -1 ) {
              it.name = `<strong>${it.name}</strong>`;
            }
          });
          this.sections = res.meta;
        } else { //case - show details
          this.userqueries = res.data[0].userqueries ? res.data[0].userqueries: [];
          this.cites = res.data[0].citation ?[res.data[0].citation]: [];
          this.citedBy =  res.data[0].score ? [res.data[0].score]: [];
        }
        console.log(this.sections)
      },
      error => {
        console.log(error);
        this.toasterService.pop('error', "error fetching search data", "please try again");
      }
    )
  }

}
