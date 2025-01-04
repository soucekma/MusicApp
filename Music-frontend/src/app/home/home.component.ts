import { Component, OnInit } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { ApiService } from '../services/api.service';
import { Musician } from '../models/musician.model';
import {NgForOf} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [
    NgForOf,
    FormsModule,
    RouterLink
  ],
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  musicians: Musician[] = [];
  searchTerm: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.getMusicians();
  }

  getMusicians(): void {
    this.apiService.getMusicians().subscribe(
      (data) => {
        console.log('Fetched musicians:', data);
        this.musicians = data;
      },
      (error) => {
        console.error('Error fetching musicians:', error);
      }
    );
  }

  onSearch(): void {
    if (this.searchTerm) {
      this.apiService.searchMusicians(this.searchTerm).subscribe(
        (data) => {
          this.musicians = data;
        },
        (error) => {
          console.error('Error searching musicians:', error);
        }
      );
    } else {
      this.getMusicians();
    }
  }

  goToDetails(id?: number): void {
    this.router.navigate([`/details/${id || ''}`]);
  }

  deleteMusician(id: number): void {
    if (confirm('Are you sure you want to delete this musician?')) {
      this.apiService.deleteMusician(id).subscribe(() => {
        this.getMusicians();
      });
    }
  }
}
