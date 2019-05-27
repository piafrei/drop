import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-privacy",
  templateUrl: "./privacy.page.html",
  styleUrls: ["./privacy.page.scss"]
})
export class PrivacyPage implements OnInit {
  constructor() {}

  public show: boolean = false;
  public buttonName: any = "Mehr lesen";

  toggle() {
    this.show = !this.show;

    // CHANGE THE NAME OF THE BUTTON.
    if (this.show) this.buttonName = "Weniger lesen";
    else this.buttonName = "Mehr lesen";
  }

  ngOnInit() {}
}
