import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Search } from '../shared/models/search.model';

type ResultType = {
  data: Search[],
  total: number
}

type ItemType = {
  data: Search[],
  type: string,
  meta: Search[]
}

@Injectable()
export class SearchService {
  constructor(private http: HttpClient) { }

  getSearchList(key: string, startIndex: number, maxLimit: number, years: string[], doctypes: string[], sort: string): Observable<ResultType> {
    let filterParam = `${years.length? `&year=${years}`: ``}${doctypes.length? `&doctype=${doctypes}`: ``}&sort=${sort}`;
    return this.http.get<ResultType>(`/api/search/items?name=${key}&startIndex=${startIndex}&maxLimit=${maxLimit}${filterParam}`, {
    headers: {
        "Authorization": `Token token=${this.hashCode()}`
    }
    });
  }

  getKeywords(): Observable<Search[]> {
    return this.http.get<Search[]>('/api/search/keywords', {
    headers: {
        "Authorization": `Token token=${this.hashCode()}`
    }
    });
  }

  getFilters(key: string): Observable<Search[]> {
    return this.http.get<Search[]>(`/api/search/filters?key=${key}`, {
    headers: {
        "Authorization": `Token token=${this.hashCode()}`
    }
    });
  }

  findByDocId(id: string): Observable<ItemType> {
    return this.http.get<ItemType>(`/api/search/${id}`, {
    headers: {
        "Authorization": `Token token=${this.hashCode()}`
    }
    });
  }

  hashCode(){
    let str = 'SearchSearchModule';
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        let char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }
}
