import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Musician } from '../models/musician.model';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  imports: [
    FormsModule,
    NgIf
  ],
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  musician: Musician = { musician_id: 0, name: '', genre: '', country: '' };
  isNew: boolean = false;
  musicianId: string = '';

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.musicianId = params.get('id') || '';
      if (this.musicianId) {
        this.isNew = false;
        this.getMusicianDetails(Number(this.musicianId));
      } else {
        this.isNew = true;
        this.initializeNewMusician();
      }
    });
  }

  getMusicianDetails(id: number): void {
    this.apiService.getMusicianById(id).subscribe((data) => {
      this.musician = data;
    });
  }

  initializeNewMusician(): void {
    this.apiService.getMusicians().subscribe((musicians) => {
      const highestId = musicians.reduce((max, musician) =>
        musician.musician_id > max ? musician.musician_id : max, 0);
      this.musician.musician_id = highestId + 1;
    });
  }

  saveMusician(): void {
    console.log('We got here')

    if (this.isNew)  {
      this.apiService.addMusician(this.musician).subscribe(
        (data) => {
          console.log('Musician added:', data);
          this.router.navigate(['/']);
        },
        (error) => {
          console.error('Error adding musician:', error);
        }
      );
    }
    else {
      const musicianToUpdate = {
        musician_id: Number(this.musicianId),
        name: this.musician.name,
        genre: this.musician.genre,
        country: this.musician.country
      };

      this.apiService.updateMusician(this.musician.musician_id, musicianToUpdate).subscribe(
        (data) => {
          console.log('Musician updated:', data);
          this.router.navigate(['/']);
        },
        (error) => {
          console.error('Error updating musician:', error);
        }
      );
    }
  }

  deleteMusician(): void {
    if (!this.isNew) {
      this.apiService.deleteMusician(this.musician.musician_id).subscribe(
        (data) => {
          console.log('Musician deleted:', data);
          this.router.navigate(['/']);
        },
        (error) => {
          console.error('Error deleting musician:', error);
        }
      );
    }
  }
}
