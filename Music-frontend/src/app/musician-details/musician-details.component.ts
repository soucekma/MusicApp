import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Albums } from '../models/albums.model';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-musician-details',
  templateUrl: './musician-details.component.html',
  styleUrls: ['./musician-details.component.css'],
  imports: [
    FormsModule,
    NgIf,
    NgForOf,
    RouterLink
  ]
})
export class MusicianDetailsComponent implements OnInit {
  musician: any;
  albums: Albums[] = [];
  newAlbum = {
    album_name: '',
    release_year: 2025,
    album_id: 0
  };
  albumToEdit: Albums | null = null;
  showAddAlbumForm: boolean = false;
  showEditAlbumForm: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.getMusicianDetails(id);
    this.getAlbumsByMusician(id);
  }

  getMusicianDetails(id: number): void {
    this.apiService.getMusicianById(id).subscribe((data) => {
      this.musician = data;
    });
  }

  getAlbumsByMusician(id: number): void {
    this.apiService.getAlbumsByMusicianId(id).subscribe((data) => {
      this.albums = data;
    });
  }

  // Add new album
  addAlbum(): void {
    if (!this.newAlbum.album_name || !this.newAlbum.release_year) {
      alert('Please fill in all fields');
      return;
    }

    this.apiService.getAlbums().subscribe(
      (albums: Albums[]) => {
        if (albums.length > 0) {
          const highestId = albums.reduce((max, album) =>
            album.album_id > max ? album.album_id : max, 0);
          this.newAlbum.album_id = highestId + 1;
        } else {
          this.newAlbum.album_id = 1;
        }

        const albumData: Albums = {
          album_id: this.newAlbum.album_id,
          album_name: this.newAlbum.album_name,
          release_year: this.newAlbum.release_year || 0,
          musician_id: this.musician.musician_id
        };

        console.log('Submitting album data:', albumData);

        this.apiService.addAlbum(albumData).subscribe(
          (data: Albums) => {
            console.log('New album added:', data);
            this.albums = Array.isArray(this.albums) ? [...this.albums, data] : [data];
            this.newAlbum = { album_name: '', release_year: 0, album_id: 0 };
            this.showAddAlbumForm = false;
          },
          (error) => {
            console.error('Error adding album:', error);
          }
        );
      },
      (error) => {
        console.error('Error fetching albums:', error);
        alert('Unable to initialize album ID.');
      }
    );
  }

  // Save album after editing
  saveAlbum(): void {
    if (this.albumToEdit) {
      // Validate input
      if (!this.albumToEdit.album_name || !this.albumToEdit.release_year) {
        alert('Please fill in all fields before saving.');
        return;
      }

      const albumToUpdate = {
        album_id: this.albumToEdit.album_id,
        album_name: this.albumToEdit.album_name,
        release_year: this.albumToEdit.release_year,
        musician_id: this.musician.musician_id,
      };

      this.apiService.updateAlbum(this.albumToEdit.album_id, albumToUpdate).subscribe(
        (data) => {
          console.log('Album updated:', data);
          this.showEditAlbumForm = false;
          this.getAlbumsByMusician(this.musician.musician_id);
          this.albumToEdit = null;
        },
        (error) => {
          console.error('Error updating album:', error);
        }
      );
    }
  }

  editAlbum(album: Albums): void {
    this.albumToEdit = { ...album };
    this.showEditAlbumForm = true;
  }

  cancelEdit(): void {
    this.showEditAlbumForm = false; // Hide edit form
    this.albumToEdit = null; // Clear edit data
  }


  // Delete album
  deleteAlbum(albumId: number): void {
    if (confirm('Are you sure you want to delete this album?')) {
      this.apiService.deleteAlbum(albumId).subscribe(
        () => {
          console.log(`Album with ID ${albumId} deleted.`);
          this.albums = this.albums.filter(album => album.album_id !== albumId);
        },
        (error) => {
          console.error('Error deleting album:', error);
        }
      );
    }
  }

  // Delete musician
  deleteMusician(): void {
    if (confirm('Are you sure you want to delete this musician?')) {
      this.apiService.deleteMusician(this.musician.musician_id).subscribe(() => {
        this.router.navigate(['/']);
      });
    }
  }
}
