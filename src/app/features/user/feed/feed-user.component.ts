import { Component } from "@angular/core";

import { FooterComponent } from "../../../components/footer/footer.component";
import { NavbarFeedComponent } from "../../../components/navbar-feed/navbar-feed.component";

@Component({
    selector: 'app-feed-user',
    standalone: true,
    imports: [
        FooterComponent,
        NavbarFeedComponent,
    ],
    templateUrl: './feed-user.component.html',
    styles: []
})
export class FeedUserComponent {}