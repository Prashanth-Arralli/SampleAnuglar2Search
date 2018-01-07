import { Component, OnInit } from '@angular/core';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit {

  constructor(private searchService: SearchService) { }

  name = '';
  description =  '';
  doctype = '';
  sections = [];
  userqueries = [];
  cites = [];
  citedBy = [];

  ngOnInit() {
    const id = window.location.pathname.split('/')[3];
    this.findByDocId(id);
  }

  findByDocId(id) {
    this.searchService.findByDocId(id).subscribe(
      res => {
        this.name = res[0].name;
        this.description = res[0].description;
        this.doctype = res[0].doctype
        if (this.doctype === 'act') {
          this.sections = [];
          res[0].sections.map((it) => {
            this.sections.push(it);
          })
        } else if (this.doctype === 'section') {
          this.sections = [];
          res[0].sections.map((it) => {
            if ( it.indexOf('(Active)') === -1 ) {
              this.sections.push(it);
            } else {
              this.sections.push('<strong>' + it + '</strong>');
            }

          })
        } else {
          this.userqueries = res[0].userqueries;
          this.cites = [res[0].citation];
          this.citedBy = [res[0].score];
        }
      },
      error => console.log(error)
    )
  }

}
