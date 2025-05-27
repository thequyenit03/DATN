import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment.development';
import { map, Observable } from 'rxjs';

interface ChatRequest {
  sessionId: string;
  message: string;
}

interface ChatResponse {
  reply: string;
}

@Injectable({
  providedIn: 'root'
})

export class ChatbotService {  

  private apiUrl = environment.hostApi + '/api/chatbot';
  constructor(private http: HttpClient) { }

  sendMessage(message: string, sessionId: string): Observable<string> {  
    const payload: ChatRequest = {sessionId, message};
    return this.http.post<ChatResponse>(this.apiUrl, payload)
      .pipe(
        map((response: ChatResponse) => response.reply)
      ); 
  }

}
