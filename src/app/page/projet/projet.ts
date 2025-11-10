import { Component } from '@angular/core';
import { Footer } from 'src/app/component/footer/footer';
import { Header } from "src/app/component/header/header";

@Component({
  selector: 'app-projet',
  imports: [Footer, Header],
  templateUrl: './projet.html',
  styleUrl: './projet.css',
})
export class Projet {}
