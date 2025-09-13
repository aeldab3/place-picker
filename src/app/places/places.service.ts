import { Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  constructor(private httpClient: HttpClient){}
  places = signal<Place[] | undefined>(undefined);
  private userPlaces = signal<Place[]>([]);
  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchPlaces(
      'http://localhost:3000/places',
      'Could not fetch places. Please try again later.'
    );
  }

  loadUserPlaces() {
    return this.fetchPlaces(
      'http://localhost:3000/user-places',
      'Could not fetch user places. Please try again later.'
    );
  }

  addPlaceToUserPlaces(placeId: string) {
    return this.httpClient.put('http://localhost:3000/user-places', { placeId } )
  }

  removeUserPlace(place: Place) {}

  private fetchPlaces(url: string, errorMessage: string){
    return this.httpClient
      .get<{ places: Place[] }>(url)
      .pipe(
        map((resData) => resData.places),
        catchError((error) => {
          return throwError(
            () => new Error(errorMessage)
          )
        })
      )
  }
}
