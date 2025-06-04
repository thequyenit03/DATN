import { Component, OnInit, HostListener } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { ChatbotService } from '../../../core/service/chatbot.service';
import { Constants } from '../../../core/util/constants';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ChatbotComponent implements OnInit {
  messages: { text: string; from: 'user' | 'bot' }[] = [];
  inputText = '';
  sessionId!: string;
  isOpen = false;

  // Default suggested questions shown when opening chat
  suggestions: string[] = [
    'Chính sách bảo hành của cửa hàng ?',
    'Hướng dẫn thanh toán ?',
    'Chính sách bảo mật ?'
  ];

  constructor(public service: ChatbotService) {}

  ngOnInit(): void {
    const storedSession = localStorage.getItem(Constants.LOCAL_STORAGE_KEY.SESSION);
    if (storedSession) {
      this.sessionId = storedSession;
    } else {
      this.sessionId = uuidv4();
      localStorage.setItem(Constants.LOCAL_STORAGE_KEY.SESSION, this.sessionId);
    }
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen && this.messages.length === 0) {
      this.messages.push({ text: 'Chào bạn! Mình có thể giúp gì?', from: 'bot' });
    }
  }

  selectSuggestion(text: string): void {
    this.inputText = text;
    this.sendMessage();
  }

  sendMessage(): void {
    const text = this.inputText.trim();
    if (!text) return;

    this.messages.push({ text, from: 'user' });
    this.inputText = '';

    this.service.sendMessage(text, this.sessionId).subscribe(
      (response: string) => {
        this.messages.push({ text: response, from: 'bot' });
        this.scrollBottom();
      },
      () => {
        this.messages.push({ text: 'Đã xảy ra lỗi khi gửi tin nhắn.', from: 'bot' });
        this.scrollBottom();
      }
    );
    this.scrollBottom();
  }

  @HostListener('document:keydown.enter', ['$event'])
  onEnter(event: KeyboardEvent) {
    if (this.isOpen && this.inputText.trim()) {
      this.sendMessage();
      event.preventDefault();
    }
  }

  private scrollBottom(): void {
    setTimeout(() => {
      const container = document.querySelector('.chat-messages');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    });
  }
}