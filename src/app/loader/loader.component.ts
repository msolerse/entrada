import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoaderService } from '../_services/loader.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit, OnDestroy {

  show: boolean;
  subscription: Subscription;

  constructor(
    private loader: LoaderService
  ) { }

  ngOnInit() {
    this.subscription = this.loader.getStatus().subscribe(status => {
      this.show = status;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
