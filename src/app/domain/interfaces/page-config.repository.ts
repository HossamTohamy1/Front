import { Observable } from 'rxjs';
import { PageConfig } from '../models/page-config.model';

export interface IPageConfigRepository {
  getPageConfig(pageKey: string): Observable<PageConfig>;
  savePageConfig(pageKey: string, config: PageConfig): Observable<PageConfig>;
  resetPageConfig(pageKey: string): Observable<PageConfig>;
}
