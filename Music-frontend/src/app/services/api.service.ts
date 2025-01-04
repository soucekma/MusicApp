import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Musician } from '../models/musician.model';
import { Albums } from '../models/albums.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/musicians';
  private apiUrl2 = 'http://localhost:3000/albums';

  constructor(private http: HttpClient) {}

  getMusicians(): Observable<Musician[]> {
    return this.http.get<Musician[]>(this.apiUrl);
  }

  getMusicianById(id: number): Observable<Musician> {
    return this.http.get<Musician>(`${this.apiUrl}/${id}`);
  }

  addMusician(musician: Musician): Observable<Musician> {
    return this.http.post<Musician>(this.apiUrl, musician);
  }

  updateMusician(id: number, musician: Musician): Observable<Musician> {
    return this.http.put<Musician>(`${this.apiUrl}/${id}`, musician);
  }

  deleteMusician(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchMusicians(term: string): Observable<Musician[]> {
    return this.http.get<Musician[]>(`${this.apiUrl}/search/${term}`);
  }
  getAlbumsByMusicianId(id: number): Observable<Albums[]> {
    return this.http.get<Albums[]>(`${this.apiUrl2}/musician/${id}`);
  }

  getAlbums(): Observable<Albums[]> {
    return this.http.get<Albums[]>(this.apiUrl2);
  }

  addAlbum(albums: Albums):Observable<Albums> {
    return this.http.post<Albums>(this.apiUrl2, albums);
  }

  updateAlbum(id: number, album: Albums):Observable<Albums> {
    return this.http.put<Albums>(`${this.apiUrl2}/${id}`, album);
}

  deleteAlbum(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl2}/${id}`);
  }

}
