import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from "@angular/router";
import {IErrorPane} from "../types/errorPane";

@Component({
  selector: 'app-error-pane',
  templateUrl: './error-pane.component.html',
  styleUrls: ['./error-pane.component.scss']
})
export class ErrorPaneComponent implements OnInit {
  @Input() error: IErrorPane;
  @Output() onClose = new EventEmitter();

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    console.log(this.error);
  }

  public onLinkClick() {
    this.router.navigate([this.error.redirect.url]);
    this.onClose.emit();
  }
}
