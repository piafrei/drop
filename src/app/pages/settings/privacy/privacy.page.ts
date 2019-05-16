import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-privacy",
  templateUrl: "./privacy.page.html",
  styleUrls: ["./privacy.page.scss"]
})
export class PrivacyPage implements OnInit {
  constructor() {}

  public show: boolean = false;
  public buttonName: any = "Show";

  toggle() {
    this.show = !this.show;

    // CHANGE THE NAME OF THE BUTTON.
    if (this.show) this.buttonName = "Hide";
    else this.buttonName = "Show";
  }

  ngOnInit() {}
}
