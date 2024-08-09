import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-chit',
  templateUrl: './chit.component.html',
  styleUrl: './chit.component.css'
})
export class ChitComponent implements OnInit{

  groups = [
    {
      groupTitle: 'Chit Group 1',
      subscribersCount: 15,
      members: ['R', 'B', 'V', 'M', 'G']
    },
    {
      groupTitle: 'Chit Group 2',
      subscribersCount: 15,
      members: ['C', 'A', 'S', 'N', 'R']
    },
    {
      groupTitle: 'Chit Group 3',
      subscribersCount: 15,
      members: ['D', 'E', 'K', 'H', 'T']
    }
  ];
  constructor(private router:Router){}

  ngOnInit(): void{

  }

  getColor(member: string): string {
    const colors = {
      'R': '#5B2C6F',
      'B': '#2874A6',
      'V': '#C0392B',
      'M': '#239B56',
      'G': '#F1C40F',
      'C': '#E74C3C',
      'A': '#2E86C1',
      'S': '#1ABC9C',
      'N': '#7D3C98',
      'D': '#76D7C4',
      'E': '#2980B9',
      'K': '#8E44AD',
      'H': '#F39C12',
      'T': '#E67E22'
    };
    return colors[member] || '#000';
  }
  
  navigate(id: any){
    this.router.navigate([`chit/view/${id}`]);
  }
}
