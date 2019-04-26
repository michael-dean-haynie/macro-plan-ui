import { Component, EventEmitter, Input, OnInit, Output, OnChanges } from '@angular/core';
import { SortDirectionEnum } from 'src/app/enums/sort-direction.enum';
import { SortableField } from 'src/app/models/sortable-field';

export interface SearchBarValues {
  searchTerm: string;
  activeSortField: string;
  activeSortDirection: SortDirectionEnum;
}

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit, OnChanges {


  @Input() searchBarValues: SearchBarValues;
  @Input() sortableFields: SortableField[];
  @Input() searchResultsCount: number;
  @Input() newButtonText: string;

  @Output() searchSubmitted = new EventEmitter<SearchBarValues>();
  @Output() newButtonClicked = new EventEmitter<void>();

  searchResultsMessage = '';

  SortDirectionEnum = SortDirectionEnum; // make it available to tempalte for comparisons

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.updateSearchResultsMessage();
  }

  onSearchSubmitted(event: Event): void {
    event.preventDefault();
    this.searchSubmitted.emit(this.searchBarValues);
  }

  onSortFieldSelected(sortField: string): void {
    this.searchBarValues.activeSortField = sortField;
    this.searchSubmitted.emit(this.searchBarValues);
  }

  onSortDirectionToggled(): void {
    this.searchBarValues.activeSortDirection =
      this.searchBarValues.activeSortDirection === SortDirectionEnum.ASC
        ? SortDirectionEnum.DESC
        : SortDirectionEnum.ASC;

    this.searchSubmitted.emit(this.searchBarValues);
  }

  onNewButtonClicked(): void {
    this.newButtonClicked.emit();
  }

  private updateSearchResultsMessage(): void {
    this.searchResultsMessage =
      `${this.searchResultsCount} results found ` +
      `(${!this.searchBarValues.searchTerm ? 'empty search' : '"' + this.searchBarValues.searchTerm + '"'})`;
  }

}
