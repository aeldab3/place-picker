import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { Place } from '../place.model';
import { PlacesComponent } from "../places.component";
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {
  places = this.PlacesService.loadedUserPlaces;
  isFetching = signal(false);
  error = signal('');
  private destroyRef = inject(DestroyRef);

  constructor(private PlacesService: PlacesService){}

  ngOnInit(): void {
    this.isFetching.set(true);
    const subscription = this.PlacesService.loadUserPlaces()
      .subscribe({
        error: (error: Error) => {
          this.error.set(error.message);
        },
        complete: () => {
          this.isFetching.set(false);
        }
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  onRemovePlace(place: Place) {
    const subscription = this.PlacesService.removeUserPlace(place).subscribe({
      error: (error: Error) => {
        this.error.set(error.message);
      }
    });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
