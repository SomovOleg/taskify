import { NgModule, importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_ROUTES } from './app.routes';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ShellComponent } from './shell/shell.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { DeskComponent } from './desk/desk.component';
import { AuthComponent } from './auth/auth.component';

import { MatCardModule } from '@angular/material/card'
import { CdkDrag, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CreateTaskComponent } from './create-task/create-task.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';

import { getFirestore, provideFirestore } from '@angular/fire/firestore'
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { AngularFireModule } from '@angular/fire/compat';
import { firebaseConfig } from 'firebaseconfig';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { ConvertTimestampPipe } from './desk/convert-timestamp.pipe';
import { TaskDialogComponent } from './desk/task-dialog/task-dialog.component';
import { TaskDeleteDialogComponent } from './desk/task-delete-dialog/task-delete-dialog.component';
import { AuthGuard } from './guards/auth-guard';


@NgModule({
  declarations: [
    AppComponent,
    ShellComponent,
    DeskComponent,
    CreateTaskComponent,
    AuthComponent,

    ConvertTimestampPipe,
     TaskDialogComponent,
     TaskDeleteDialogComponent,
  ],
  imports: [
    //Angular
    RouterModule.forRoot(APP_ROUTES, { enableTracing: false }),
    CommonModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

    //Firebase
    AngularFireModule,

    //Material
    MatCardModule,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  providers: [
    importProvidersFrom([
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),]),

    AuthGuard
    ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
