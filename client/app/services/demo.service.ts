import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Demo } from '../shared/models/demo.model';

@Injectable()
export class DemoService {
  constructor(private http: HttpClient) { }

  getSearchList(key: string, startIndex: number, maxLimit: number, selectedFilters: Map<string, string>): Observable<Demo[]> {
    let filterParam = `${selectedFilters.year? `&year=${selectedFilters.year}`: ``}${selectedFilters.doctype? `&doctype=${selectedFilters.doctype}`: ``}${selectedFilters.category? `&category=${selectedFilters.category}`: ``}`;
    if (selectedFilters.year) {
      filterParam += ``
    }
    return this.http.get<Demo[]>(`/api/search/items?name=${key}&startIndex=${startIndex}&maxLimit=${maxLimit}${filterParam}`, {
    headers: {
        "Authorization": `Token token=${this.hashCode()}`
    }
    });
  }

  getKeywords(): Observable<Demo[]> {
    return this.http.get<Demo[]>('/api/search/keywords', {
    headers: {
        "Authorization": `Token token=${this.hashCode()}`
    }
    });
  }

  getFilters(key: string): Observable<Demo[]> {
    console.log(this.hashCode())
    return this.http.get<Demo[]>(`/api/search/filters?key=${key}`, {
    headers: {
        "Authorization": `Token token=${this.hashCode()}`
    }
    });
  }

  hashCode(){
    let str = 'demoSearchModule';
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        let char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }
}
