import { Component, OnInit } from '@angular/core';
import { ToolbarService } from '../_services/toolbar.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})

export class ToolbarComponent implements OnInit {

  icon: string;

  title = 'Entrada de Mercancias';
  
  constructor(private router: Router,
              private route: ActivatedRoute,
              private ts: ToolbarService,
              private location: Location) { }

  ngOnInit() {

    this.ts.currentMessage.subscribe(message => this.icon = message);
  }

  goBack(): void {

    this.location.back();

  }

}
