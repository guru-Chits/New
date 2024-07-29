import { Component, Input, OnInit } from '@angular/core';
import { ITableColumn } from '../../interface/list-table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-table',
  templateUrl: './list-table.component.html',
  styleUrl: './list-table.component.css'
})
export class ListTableComponent implements OnInit {
  @Input() columns: ITableColumn[] = [];
  @Input() tableData: any[] = [];
  @Input() options: any = {};
  constructor(private route: Router) {}

  ngOnInit(): void {
    
  }
}
