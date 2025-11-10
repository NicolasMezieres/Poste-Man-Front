import { Component } from '@angular/core';
import { Header } from '../header/header';
import { Search } from "../input/search/search";
import { Create } from "../button/create/create";
@Component({
  selector: 'app-side-bar',
  imports: [Header, Search, Create],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css',
})
export class SideBar {}
