import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class LandingService {
  private taskHistoryApiUrl = "/api/chat/generate/sql";

  constructor(private http: HttpClient) {
  }

  getResponse(userPrompt: any): Observable<any> {
    return this.http.post<any>(this.taskHistoryApiUrl, {userPrompt}, {
      headers: new HttpHeaders({'no-loader': 'true'}),
      responseType: 'text' as 'json'
    });
  }
}
