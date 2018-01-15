// Description - only search box - Home Page

import { Component, OnInit } from '@angular/core';
import { SearchService } from '../services/search.service';
import { Title }     from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  keywords = [];

  constructor(private searchService: SearchService,
              private titleService: Title) { }

  ngOnInit() {
    this.getKeywords();
    this.titleService.setTitle( 'Homepage' );
  }

  //fetch keywords on init
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
}
