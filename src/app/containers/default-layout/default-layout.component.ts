import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from 'src/app/theme.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})

export class DefaultLayoutComponent implements OnInit {
  public sidebarMinimized = false;
 
  constructor(
    private router: Router, private themeService: ThemeService) {
  }
  ngOnInit() {
   
  }

  changeTheme(theme: string) {
    this.themeService.switchTheme(theme);
}
  
}
