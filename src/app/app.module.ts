import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import 'polyfills';
import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

/* Components */
import { ActivityComponent } from './components/activity/activity.component';
import { AppComponent } from './app.component';
import { ArchivesSpaceComponent } from './components/archivesspace/archivesspace.component';
import { ArkEditorComponent } from './components/ark-editor/ark-editor.component';
import { FileBrowserComponent } from './components/file-browser/file-browser.component';
import { FileViewComponent } from './components/file-view/file-view.component';
import { ItemViewComponent } from './components/item-view/item-view.component';
import { LoggerComponent } from './components/logger/logger.component';
import { NotificationComponent } from './components/notification/notification.component';
import { StandardComponent } from './components/standard/standard.component';
import { TreeViewComponent } from './components/tree-view/tree-view.component';

/* Modules */
import { AppRoutingModule } from './app-routing.module';

/* Directives */
import { FileDraggable } from './directives/file-draggable.directive';

/* Services */
import { AccessService } from './services/access.service';
import { ActivityService } from './services/activity.service';
import { ArchivesSpaceService } from './services/archivesspace.service';
import { CsvService } from './services/csv.service';
import { ElectronService } from './services/electron.service';
import { ExportService } from './services/export.service';
import { FilesService } from './services/files.service';
import { GreensService } from './services/greens.service';
import { LocalStorageService } from './services/local-storage.service';
import { LoggerService } from './services/logger.service';
import { MapService } from './services/map.service';
import { PreservationService } from './services/preservation.service';
import { ProductionNotesService } from './services/production-notes.service';
import { SaveService } from './services/save.service';
import { SessionStorageService } from './services/session-storage.service';
import { StandardItemService } from './services/standard-item.service';


@NgModule({
  declarations: [
    ActivityComponent,
    AppComponent,
    ArchivesSpaceComponent,
    ArkEditorComponent,
    FileBrowserComponent,
    FileViewComponent,
    ItemViewComponent,
    LoggerComponent,
    NotificationComponent,
    StandardComponent,
    TreeViewComponent,

    FileDraggable
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    NgbModule.forRoot()
  ],
  providers: [
    AccessService,
    ActivityService,
    ArchivesSpaceService,
    CsvService,
    ElectronService,
    ExportService,
    FilesService,
    GreensService,
    LocalStorageService,
    LoggerService,
    MapService,
    PreservationService,
    ProductionNotesService,
    SaveService,
    SessionStorageService,
    StandardItemService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
