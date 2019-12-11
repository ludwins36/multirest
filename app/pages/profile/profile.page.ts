import { Component, OnInit } from '@angular/core';
import { Events, MenuController, LoadingController, AlertController, Platform } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Storage } from '@ionic/storage';
// import { UsersProvider } from '../../providers/users';
import { Router } from '@angular/router';

// import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
// import {File} from '@ionic-native/file';
// import {FilePath} from '@ionic-native/file-path';
import { Camera,CameraOptions } from '@ionic-native/camera/ngx';
import { AuthService } from 'src/app/services/auth.service';
declare var cordova: any;


@Component({
	selector: 'app-profile',
	templateUrl: './profile.page.html',
	styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

	addressForm : FormGroup;
	user: any;
	loading: any;
	my_photo: any = null;

	constructor(
		// public menuCtrl: MenuController, 
		// public events: Events, 
		// public alertCtrl: AlertController, 
		// private storage: Storage, 
		// public loadingCtrl: LoadingController, 
		// public usersProv: AuthService, 
		// private formBuilder: FormBuilder,
		// private router: Router,
		// public camera: Camera,
		// // public file: File,
		// // public filePath: FilePath,
		// // public transfer: FileTransfer,
		// public platform: Platform
	) {
		
	}


	// ionViewWillEnter(){
	// 	this.storage.ready().then(() => {
	// 		this.storage.get('user').then((val) => {
	// 			console.log(val);
	// 			this.user = val;
	// 			this.addressForm = this.formBuilder.group({
	// 				username: [val.username],
	// 				fullname: [val.fullname],
	// 				address: [val.address],
	// 				phone: [val.phone]
	// 			});
	// 		})
	// 	})
	// }






	selectPhotoOptions(){
		this.presentAlertConfirm();
	}


	async presentAlertConfirm() {

	}

	updateAddress(){
		/**
		this.usersProv.updateUser(this.user.id, this.addressForm.value).then(data => {
			this.loading.dismiss().then(() => {
				console.log(data);

				this.user.username = this.addressForm.value.username;
				this.user.fullname = this.addressForm.value.fullname;
				this.user.address = this.addressForm.value.address;
				this.user.phone = this.addressForm.value.phone;

				this.storage.set('user', this.user);
				this.events.publish('user: change', this.user);
			});
		}, error => {
			this.loading.dismiss().then(() => {
				this.presentAlertErr(error);
			});
		});
		
		*/
		// this.presentLoading();
	}

	// logout() {
	// 	this.usersProv.logoutUser().then(() => {
	// 		this.storage.remove('user');
	// 		this.user = null;
	// 		this.router.navigateByUrl('/login');
	// 		this.menuCtrl.enable(false);
	// 	});
	// }


	// async presentLoading() {
	// 	this.loading = await this.loadingCtrl.create({
	// 		message: 'waiting',
	// 		duration: 2000
	// 	});
	// 	return await this.loading.present();
	// }

	// async presentAlertErr(err) {
	// 	const alert = await this.alertCtrl.create({
	// 		message: err.message,
	// 		buttons: [{
	// 			text: "Ok",
	// 			role: 'cancel'
	// 		}]
	// 	});
	// 	await alert.present();
	// }


	ngOnInit() {
	}

}
