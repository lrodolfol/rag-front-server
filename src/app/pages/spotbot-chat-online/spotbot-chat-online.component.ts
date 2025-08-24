import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';

interface ChatMessage {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

@Component({
  selector: 'app-spotbot-chat-online',
  templateUrl: './spotbot-chat-online.component.html',
  styleUrls: ['./spotbot-chat-online.component.css']
})
export class SpotbotChatOnlineComponent implements AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  messages: ChatMessage[] = [];
  currentMessage: string = '';
  isLoading: boolean = false;
  private apiUrl = `${environment.urlApi}api/v1/askme-chat-online`;
  private messageIdCounter: number = 1;

  constructor(private http: HttpClient) {}

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  sendMessage() {
    if (!this.currentMessage.trim() || this.isLoading) {
      return;
    }

    // Adiciona mensagem do usuário
    const userMessage: ChatMessage = {
      id: this.messageIdCounter++,
      text: this.currentMessage,
      isUser: true,
      timestamp: new Date()
    };
    this.messages.push(userMessage);

    const messageToSend = this.currentMessage;
    this.currentMessage = '';
    this.isLoading = true;

    // Simula chamada para API (substitua pela sua API real)
    this.callApi(messageToSend).subscribe({
      next: (response) => {
        const botMessage: ChatMessage = {
          id: this.messageIdCounter++,
          text: response.message || 'Resposta recebida da API',
          isUser: false,
          timestamp: new Date()
        };
        this.messages.push(botMessage);
        this.isLoading = false;
      },
      error: (error) => {
        const errorMessage: ChatMessage = {
          id: this.messageIdCounter++,
          text: 'Erro ao conectar com a API. Tente novamente.',
          isUser: false,
          timestamp: new Date()
        };
        this.messages.push(errorMessage);
        this.isLoading = false;
      }
    });
  }

  private callApi(message: string) {
    const apiUrl = `${this.apiUrl}`;
    
    const payload = {
      text: message,
      historic: this.messages
    };

    return this.http.post<any>(apiUrl, payload);
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch(err) {}
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
}
