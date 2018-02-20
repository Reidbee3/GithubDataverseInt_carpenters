import { Component, Input, ElementRef, Renderer } from '@angular/core';

import { ArchivesSpaceService } from 'app/services/archivesspace.service';
import { StandardItemService } from 'app/services/standard-item.service';
import { FilesService } from 'app/services/files.service';
import { ElectronService } from 'app/services/electron.service';
import { LoggerService } from 'app/services/logger.service';
import { PreferencesService } from 'app/services/preferences.service';

@Component({
  selector: 'file-view',
  templateUrl: './file-view.component.html',
  styleUrls: [ './file-view.component.scss' ]
})
export class FileViewComponent {

  preferences: any;

  @Input() children: any;

  constructor(
    private asService: ArchivesSpaceService,
    private standardItems: StandardItemService,
    private renderer: Renderer,
    private files: FilesService,
    private electronService: ElectronService,
    private log: LoggerService,
    private preferenceService: PreferencesService) {

      this.preferenceService.preferencesChange.subscribe((data) => {
        this.preferences = data;
      });
      this.preferences = this.preferenceService.data;

      let obj = this.asService.selectedArchivalObjects();
      if (obj.length === 0) {
        this.standardItems.getAll();
      }
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
    let index = c.files.findIndex(file => file.uuid === uuid);
    this.files.orphanFile(c, c.files[index]);
    c.files.splice(index, 1);
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

}
