import {
  Component, ElementRef, Renderer, AfterViewInit,
  OnInit, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';

import { ArchivesSpaceService } from 'app/services/archivesspace.service';
import { StandardItemService } from 'app/services/standard-item.service';
import { FilesService } from 'app/services/files.service';
import { ElectronService } from 'app/services/electron.service';
import { LoggerService } from 'app/services/logger.service';
import { ObjectService } from 'app/services/object.service';
import { PreferencesService } from 'app/services/preferences.service';

@Component({
  selector: 'file-list',
  templateUrl: './file-list.component.html',
  styleUrls: [ './file-list.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileListComponent implements OnInit, AfterViewInit {

  preferences: any;
  child: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private asService: ArchivesSpaceService,
    private standardItems: StandardItemService,
    private renderer: Renderer,
    private files: FilesService,
    private electronService: ElectronService,
    private log: LoggerService,
    private preferenceService: PreferencesService,
    private objectService: ObjectService) {

      this.preferenceService.preferencesChange.subscribe((data) => {
        this.preferences = data;
      });
      this.preferences = this.preferenceService.data;

      let obj = this.asService.selectedArchivalObjects();
      if (obj.length === 0) {
        this.standardItems.getAll();
      }

      this.files.filesChanged.subscribe((files) => {
        this.detechChange();
      });

      this.objectService.objectChanged.subscribe((obj) => {
        this.child = obj;
        this.files.updateFileAssignment(obj);
        this.detechChange();
      });
  }

  ngOnInit() {
    this.asService.containersChanged.subscribe(() => {
      this.detechChange();
    });
  }

  ngAfterViewInit() {
    this.cdr.detach();
  }

  getParents(c: any): any[] {
    return this.asService.parentsToArray(c);
  }

  displayContainer(c: any): string {
    return c.containersLoading ? 'Loading container information'
      : this.asService.displayContainer(c);
  }

  containerClass(c: any): string {
    return ['object-container', c.level].join(' ');
  }

  removeFile(c: any, uuid: string): void {
    this.files.orphanFile(c, uuid);
  }

  handleDrop(c: any, purpose: string, e: any): void {
    e.stopPropagation();
    e.preventDefault();
    this.renderer.setElementClass(e.target, 'hover', false);
    let dropFiles:File[];
    try {
      dropFiles = JSON.parse(e.dataTransfer.getData('text'));
      if (!Array.isArray(dropFiles)) {
        dropFiles = [dropFiles];
      }
    }
    catch(execption) {
      dropFiles = e.dataTransfer.files;
    }
    let files = [];
    for( let file of dropFiles ) {
      files.push(file.path);
    }
    this.files.addFilesToObject(c, purpose, files);
  }

  handleDragEnter(target: ElementRef): void {
    this.renderer.setElementClass(target, 'hover', true);
  }

  handleDragLeave(target: ElementRef): void {
    this.renderer.setElementClass(target, 'hover', false);
  }

  addFile(c: any, type: string): void {
    if (c.containersLoading) {
      this.log.warn("Hold on, containers are still loading");
      return;
    }
    this.files.addFilesToObject(c, type);
  }

  openFile(path: string): void {
    this.electronService.shell.openItem(path);
  }

  openArchivalObjectUrl(c: any) {
    if (!this.preferences.archivesspace.frontend) {
      this.log.warn('Please include the Archives Space Frontend URL in preferences.');
      return;
    }

    if (c.artificial && c.parent_uri) {
      this.electronService.shell.openExternal(this.preferences.archivesspace.frontend + c.parent_uri);
    }
    else if(c.record_uri) {
      this.electronService.shell.openExternal(this.preferences.archivesspace.frontend + c.record_uri);
    }
  }

  openContainerFolder(c: any) {
    if (c.containers.length === 0) {
      this.log.warn("Sorry, this object doesn't have a container, or is still waiting to be loaded");
      return;
    }
    let path = this.files.fullContainerPath(c.containers[0]);
    if (!this.electronService.shell.openItem(path)) {
      this.log.warn("Sorry couldn't open container in the filesystem.");
    }
  }

  trackByFileUuid(index, file) {
    return file.uuid;
  }

  trackByChildUuid(index, child) {
    return child.uuid;
  }

  trackByPurposeName(index, purpose) {
    return purpose.name;
  }

  private detechChange(): void {
    if (!this.cdr['destroyed']) {
      this.cdr.detectChanges();
    }
  }


}