import { Component, OnInit, Input } from '@angular/core';
import { Anime } from '../models/model.anime';
import { ActivatedRoute } from '@angular/router';
import { AnimeServiceService } from '../services/anime-service.service';
import { LogInService } from '../services/log-in.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-display-anime',
  templateUrl: './display-anime.component.html',
  styleUrls: ['./display-anime.component.css']
})
export class DisplayAnimeComponent implements OnInit {

  public anime: Anime = {
    id: 0,
    name: '',
    description: '',
    picture: '',
    picture_URL: '',
    date_aired: '',
    total_score: 0,
    score: 0
  };
  public rateForm : FormGroup;
  public commentForm : FormGroup;
  public ratedAnime : Anime[] = [];
  public ratedObser : Observable<Anime[]>;
  public wishListAnime : Anime[] = [];
  public watchedListAnime : Anime[] = [];
  public currentUser : string = '';
  public onWishList : boolean = false;
  public onWatchList : boolean = false;
  public onRateList : boolean = false;

  constructor(
    private route: ActivatedRoute,
    private animeService : AnimeServiceService,
    public loginService : LogInService,
    private formbuilder : FormBuilder) {

        this.rateForm = this.formbuilder.group({
          rating: ['', [Validators.required]]
        });

        this.commentForm = this.formbuilder.group({
          comment: ['', [Validators.required]]
        });

     }


  ngOnInit(): void {
    console.log(this.loginService.getLoggedInUserUsername());

    this.currentUser = this.loginService.getLoggedInUserUsername();
    this.route.paramMap.subscribe(params => {
      const animeName: string = params.get('name');
      this.animeService.getAnimeByName(animeName).subscribe((anime) => {
        this.anime = anime[0];

        if(this.currentUser != undefined){

          this.animeService.AnimeRatedList(this.currentUser).subscribe((res) => {
            res.forEach((rAnime) => {
              this.ratedAnime.push(rAnime);
              if(rAnime.name == this.anime.name){
                this.onRateList = true;             
              }
            });
          });
  
          this.animeService.AnimeWatchedlist(this.currentUser).subscribe((res) => {         
            res.forEach((wAnime) => {
              this.watchedListAnime.push(wAnime);
              if(wAnime.name == this.anime.name){
                this.onWatchList = true;
              }
            });
          });
  
          this.animeService.AnimeWishlist(this.currentUser).subscribe((res) => {
            res.forEach((wiAnime) => {
              this.wishListAnime.push(wiAnime);
              if(wiAnime.name == this.anime.name){
                this.onWishList = true;
              }
            });
          });
  
        }else{
          
        }

      });
  });
}

public addToWish() {

  if(this.loginService.isUserLoggedIn()){
    this.animeService
    .addAnimeToWishlist(this.loginService.getLoggedInUserUsername(), this.anime.name).subscribe((res) => {
      console.log(res);
      
    });
  }

  this.animeService.AnimeWishlist(this.loginService.getLoggedInUserUsername()).subscribe((res) => {
    console.log(res);
  });

}

public addToWatched() {

  if(this.loginService.isUserLoggedIn()){
    this.animeService
    .addAnimeToWatchlist(this.loginService.getLoggedInUserUsername(), this.anime.name).subscribe();
  }

  this.animeService.AnimeWatchedlist(this.loginService.getLoggedInUserUsername()).subscribe((res) => {
    console.log(res);
  });

}

public onComment(data){
    console.log(data);
    this.animeService.commentThisAnime(this.currentUser, this.anime.name, data['comment']).subscribe(
      () => {
         this.animeService.getAnimeByName(this.anime.name).subscribe((data) => {
          this.anime = data;
         })
      }
    );
}

public rate(data) {
    console.log(data);
    this.onRateList = true;
    this.animeService.rateThisAnime(this.loginService.getLoggedInUserUsername(), this.anime.name, data['score']).subscribe(
      () => {
         this.animeService.getAnimeByName(this.anime.name).subscribe((data) => {
          this.anime = data;
         })
      }
    );
}
    

}

