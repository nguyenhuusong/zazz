import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-detail',
  templateUrl: './loading-detail.component.html',
  styleUrls: ['./loading-detail.component.css']
})
export class LoadingDetailComponent implements OnInit {

  @Input() id: string = '';
  ngOnInit(): void {
    
  }
}