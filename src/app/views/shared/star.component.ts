import { Component, OnChanges, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'pm-star',
  templateUrl: './star.component.html',
  styleUrls: ['./star.component.css']
})
export class StarComponent implements OnChanges {
  @Input() rating = 0; // Max-rate
  @Input() userRating = 0; // Rating do user na skill
  @Input() idHabilidade: number;
  starWidth = 0;
  @Output() ratingClicked = new EventEmitter();

  ngOnChanges(): void {
    this.starWidth = this.rating * 75 / 5;
  }

  onClick(nivel: number): void {
    this.userRating = nivel;
    this.ratingClicked.emit({"id_habilidade": this.idHabilidade, "nivel": nivel});
  }
}
