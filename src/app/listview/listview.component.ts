import { Component,OnInit, NgModule,Directive,Input,Output,EventEmitter,HostBinding,  HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute,Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {CryptoserviceService} from '../cryptoservice.service'
import {NgModel} from '@angular/forms';
import { HttpClient,HttpErrorResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatIconModule} from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';

import 'hammerjs';

@Component({
  selector: 'app-listview',
  templateUrl: './listview.component.html',
  styleUrls: ['./listview.component.css']
})
export class ListviewComponent implements OnInit {
   
  public displaycheckbox:boolean=false;
  public pricechart="/pricechart";
  public colorfav="primary";
 public color = 'primary';
 public  p: number = 1;
public alldata:any=[];
public datarray:any=[];
public favstatus:boolean=false;
public sortvar:boolean=false;
public len:any=[];
public favoritelink:boolean=false;
public dummyarray:any=[];
public currentfav:any=[];
public cookieValue;
public cookieID:any=[];
public ob1:any = []; public ob2:any = []; public count:number=0; public checked = false;
  constructor(public _route:ActivatedRoute,public router:Router,public toastr:ToastrService,public cryptoservice:CryptoserviceService,private cookieService: CookieService){
      console.log("listview called");
      
  }

  public currencylist():any {
    this.cryptoservice.currencylist().subscribe(
      data =>{
        for(let d in data.data)
        {
          this.alldata.push(data.data[d]);
          for(let dm in this.dummyarray){
          if(this.cookieService.check(this.dummyarray[dm].id)){
            this.cookieID.push(this.dummyarray[dm].id);
          }   
        }this.dummyarray.push(data.data[d]);
        }
        //console.log(this.dummyarray);
        
        
        for(let i in this.alldata)
        {
          this.datarray.push(this.alldata[i]);  
        }
        console.log(this.alldata);
        console.log(this.alldata.length);
        
      },
      error=>{
        console.log("Error");
        console.log(error.status);
            
      }
      
    )
  }

public activelink() {
    this.datarray = [];
    if(this.datarray.length === 0){
      for(let i in this.dummyarray)
        {
            this.datarray.push(this.dummyarray[i]);
            
        }
    }
    
}

public checkboxdisplay() {
  this.displaycheckbox = !this.displaycheckbox;
  
}

public addfavorite(id) {
  let obj=[];
  this.favstatus = !this.favstatus;
  for(let f in this.dummyarray){
    if(this.dummyarray[f].id===id){
      this.toastr.success(this.dummyarray[f].name+" Added to Favorite");
      localStorage.setItem(this.dummyarray[f].id,this.dummyarray[f].name);
    }
    else {}
  }
}

public remfavorite(id){
    if(localStorage.getItem(id)){
      localStorage.removeItem(id);
      this.toastr.warning("Oops Removed from Favorite");
    }  
    else {
      this.toastr.warning(`You did not add ${id} as Favorites`);
    }
}

public gofavlist() {
  this.toastr.info("Here is your Favorite coins list");
  this.favoritelink = !this.favoritelink;  
  this.datarray=[];
  for(let dm in this.dummyarray){
     if(localStorage.getItem(this.dummyarray[dm].id)){
      this.datarray.push(this.dummyarray[dm]);
    } 
  }
}


public displaysorting() {
  this.toastr.info("Choose a range to know the Price or MarketCap");

  this.sortvar = !this.sortvar;
  console.log(this.datarray.length);
    if(this.datarray.length > 0)
    {     
      this.datarray=[];
      for(let a in this.dummyarray)
      {
          this.datarray.push(this.dummyarray[a]);
      }
      //console.log(this.datarray.length);
    }
    else if(this.datarray.length === 0)
    {
      console.log(this.datarray.length);
      for(let a in this.dummyarray)
      {
          this.datarray.push(this.dummyarray[a]);
      }
      console.log(this.datarray);
    } 
    else{}
}

//sorting of price
public  sortprice(p):any {
  this.cryptoservice.sortprice(p).subscribe(
    data =>{
      this.alldata = [];
      this.datarray=[];
      for(let d in data.data)
      {
        this.alldata.push(data.data[d]);
      }
      function compare(a,b) {
        if (a.quotes.USD.price > b.quotes.USD.price )
          return -1;
        if (a.quotes.USD.price  < b.quotes.USD.price )
         return 1;
        return 0;
     }

     this.alldata.sort(compare);

      for(let y in this.alldata)
        {
            if(this.alldata[y].quotes.USD.price <= p)
            {
              this.datarray.push(this.alldata[y]);

            }          
        }
      
    },
    error=>{
      console.log("Error");
      console.log(error.status);     
    }    
  )
}

//navigate to price chart
public gopricechart(v) {
  this.toastr.info("Price Chart View ");
  this.router.navigate(['/pricechart'],{ queryParams: {pc:v} });
}

public gocomparelist() {
  this.router.navigate(['/comparison'],{ queryParams: {c1:this.ob2[0].id,c2:this.ob2[1].id } });

}

public check(e,val) {
  if(e.checked===true){
    this.count++;
    for(let dm in this.datarray){
      if(this.datarray[dm].id==val){
          this.ob1.push(this.datarray[dm]);
      } 

    }
  }
  if(e.checked===false){
    this.count--;
    for(let del in this.ob1){
      if(this.ob1[del].id==val){
        this.ob1.splice(del,1);
      }
      
    }
  }
  if(this.ob1.length==2){
    this.count=2;
    this.ob2 = this.ob1;
  }
  console.log(this.ob1);
  console.log(this.ob2);
}

public sortmarketcap(m):any {
  this.cryptoservice.sortmarketcap(m).subscribe(
    data =>{
      this.alldata = [];
      this.datarray=[];
      for(let dt in data.data)
      {
        this.alldata.push(data.data[dt]);
      }

      function compare(a,b) {
        if (a.quotes.USD.market_cap > b.quotes.USD.market_cap )
          return -1;
        if (a.quotes.USD.market_cap < b.quotes.USD.market_cap )
        return 1;
        return 0;
      }
      this.alldata.sort(compare);
     
      for(let x in this.alldata)
      {
        if(this.alldata[x].quotes.USD.market_cap <= m)
        {
          this.datarray.push(this.alldata[x]); 
        }
      }
    },
error=>{
  console.log("Error");
  console.log(error.status);
      
}

)
}



 ngOnInit() {
    this.currencylist();
    
   

  }

}
