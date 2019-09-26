import {
  Component, ChangeDetectorRef
  , OnInit
} from '@angular/core';
import { ToolbarService } from '../_services/toolbar.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})

export class ToolbarComponent implements OnInit {

  icon: string;

  title = 'Entrada de Mercancias';
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private ts: ToolbarService,
    private location: Location,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }


  ngOnInit() {

    this.ts.currentMessage.subscribe(message => this.icon = message);
  }

  goBack(): void {

    this.location.back();

  }

}
