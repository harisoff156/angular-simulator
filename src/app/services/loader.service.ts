import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private readonly loadingSubject = new BehaviorSubject(false);
  public readonly isLoading$ = this.loadingSubject.asObservable();

  public showLoader(): void {
    this.loadingSubject.next(true);
  }

  public hideLoader(): void {
    this.loadingSubject.next(false);
  }
}
