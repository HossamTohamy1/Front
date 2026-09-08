import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, MessageSquare, X, Send } from 'lucide-angular';
import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { ChatConversation } from '../../domain/models/chat.model';
import { getInitials } from '../../shared/utils/initials.utils';

@Component({
  selector: 'app-dashboard-floating-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, TranslatePipe, TranslateDirective],
  template: `
    <!-- Floating Chat Trigger Button -->
    <button
      type="button"
      class="dashboard-chat-button"
      (click)="toggleChat.emit()"
      [attr.aria-label]="'DASHBOARD.CHAT.OPEN' | translate"
    >
      <lucide-icon [img]="MessageSquareIcon" [size]="27" strokeWidth="2.1"></lucide-icon>
      <span class="dashboard-chat-button__count dashboard-number" *ngIf="unreadCount > 0">{{ unreadCount }}</span>
    </button>

    <!-- Floating Chat Popover Window -->
    <div class="admin-floating-chat" *ngIf="isOpen" dir="rtl">
      <section class="admin-floating-chat__panel" role="dialog">
        <header class="admin-floating-chat__header">
          <div>
            <h3>{{ 'DASHBOARD.CHAT.TITLE' | translate }}</h3>
            <p>{{ 'DASHBOARD.CHAT.SUBTITLE' | translate }}</p>
          </div>
          <button type="button" class="admin-floating-chat__close" (click)="toggleChat.emit()" [attr.aria-label]="'COMMON.CLOSE' | translate">
            <lucide-icon [img]="XIcon" [size]="20"></lucide-icon>
          </button>
        </header>

        <div class="admin-floating-chat__body">
          <aside class="admin-floating-chat__sidebar">
            <div class="admin-floating-chat__conversations">
              <button
                type="button"
                *ngFor="let conv of conversations"
                class="admin-floating-chat__conversation"
                [class.is-active]="conv.id === activeChatId"
                (click)="selectConversation.emit(conv.id)"
              >
                <span class="admin-floating-chat__avatar">{{ initials(conv.customerName) }}</span>
                <span class="admin-floating-chat__conversation-main">
                  <span class="admin-floating-chat__customer-head">
                    <strong>{{ conv.customerName }}</strong>
                    <time>{{ conv.lastTime }}</time>
                  </span>
                  <span class="admin-floating-chat__conversation-preview">
                    <span>{{ conv.lastMessage }}</span>
                    <b *ngIf="conv.unread > 0">{{ conv.unread }}</b>
                  </span>
                </span>
              </button>
            </div>
          </aside>

          <div class="admin-floating-chat__room" *ngIf="activeConversation">
            <header class="admin-floating-chat__room-header">
              <div class="admin-floating-chat__customer">
                <span class="admin-floating-chat__avatar">{{ initials(activeConversation.customerName) }}</span>
                <div>
                  <strong>{{ activeConversation.customerName }}</strong>
                  <span>{{ activeConversation.orderNumber ? ('DASHBOARD.CHAT.ORDER_NO' | translate) + ' ' + activeConversation.orderNumber : activeConversation.customerPhone }}</span>
                </div>
              </div>
            </header>

            <div class="admin-floating-chat__messages">
              <div
                *ngFor="let msg of activeConversation.messages"
                class="admin-floating-chat__message"
                [class.is-own]="msg.sender === 'staff'"
              >
                <div class="admin-floating-chat__bubble">
                  <p>{{ msg.text }}</p>
                  <div class="admin-floating-chat__bubble-meta">
                    <span>{{ msg.time }}</span>
                  </div>
                </div>
              </div>
            </div>

            <form class="admin-floating-chat__composer" (ngSubmit)="send()">
              <textarea
                [(ngModel)]="chatText"
                name="chatMsg"
                [placeholder]="'DASHBOARD.CHAT.PLACEHOLDER' | translate"
                rows="1"
                (keydown.enter)="$event.preventDefault(); send()"
              ></textarea>
              <button type="submit" class="admin-floating-chat__send" [disabled]="!chatText.trim()">
                <lucide-icon [img]="SendIcon" [size]="20"></lucide-icon>
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class DashboardFloatingChatComponent {
  readonly MessageSquareIcon = MessageSquare;
  readonly XIcon = X;
  readonly SendIcon = Send;

  @Input() isOpen = false;
  @Input() conversations: ChatConversation[] = [];
  @Input() activeChatId: string | null = null;
  @Input() unreadCount = 0;

  chatText = '';

  @Output() toggleChat = new EventEmitter<void>();
  @Output() selectConversation = new EventEmitter<string>();
  @Output() sendMessage = new EventEmitter<string>();

  get activeConversation(): ChatConversation | undefined {
    return this.conversations.find(c => c.id === this.activeChatId);
  }

  initials(name?: string): string {
    return getInitials(name);
  }

  send(): void {
    if (!this.chatText.trim()) return;
    this.sendMessage.emit(this.chatText.trim());
    this.chatText = '';
  }
}

