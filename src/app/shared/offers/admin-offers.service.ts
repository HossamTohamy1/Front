import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

export type ManagedOffer = {
  id: string;
  title: string;
  description: string;
  duration: string;
  image: string;
  createdAt: string;
  updatedAt: string;
};

@Injectable({
  providedIn: 'root'
})
export class AdminOffersService {
  private http = inject(HttpClient);
  private offersSignal = signal<ManagedOffer[]>([]);
  public offers = this.offersSignal.asReadonly();

  constructor() {
    if (typeof window !== 'undefined') {
      this.fetchOffers();
    }
  }

  fetchOffers(): void {
    this.http.get<any>(`${environment.apiBaseUrl}/offers`).subscribe({
      next: (res: any) => {
        const data = res?.data || res || [];
        this.offersSignal.set(data);
      },
      error: (err: any) => console.error(err)
    });
  }

  upsertManagedOffer(offer: ManagedOffer): void {
    const isNew = !offer.id || offer.id.startsWith('temp-') || offer.id.length < 30;
    if (isNew) {
      this.http.post<any>(`${environment.apiBaseUrl}/offers`, offer).subscribe({
        next: (res: any) => this.fetchOffers(),
        error: (err: any) => console.error(err)
      });
    } else {
      this.http.put<any>(`${environment.apiBaseUrl}/offers/${offer.id}`, offer).subscribe({
        next: (res: any) => this.fetchOffers(),
        error: (err: any) => console.error(err)
      });
    }
  }

  deleteManagedOffer(offerId: string): void {
    this.http.delete<any>(`${environment.apiBaseUrl}/offers/${offerId}`).subscribe({
      next: (res: any) => this.fetchOffers(),
      error: (err: any) => console.error(err)
    });
  }
}
