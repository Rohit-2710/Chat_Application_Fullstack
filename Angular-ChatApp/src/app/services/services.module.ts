import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APIServiceService } from './APIService/apiservice.service';
import { AuthServiceService } from './auth-guards/auth-service.service';
import { SocketServiceService } from './socketService/socket-service.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [APIServiceService, AuthServiceService, SocketServiceService],
})
export class ServicesModule {}
