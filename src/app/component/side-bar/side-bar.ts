import { Component } from '@angular/core';
import { Header } from '../header/header';
import { Search } from "../input/search/search";
import { Create } from "../button/create/create";
import { Footer } from "../footer/footer";
import { Project } from "../project/project";
@Component({
  selector: 'app-side-bar',
  imports: [Header, Search, Create, Footer, Project],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css',
})
export class SideBar {}
