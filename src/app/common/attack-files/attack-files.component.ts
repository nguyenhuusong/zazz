import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-attack-files',
  templateUrl: './attack-files.component.html',
  styleUrls: ['./attack-files.component.scss']
})
export class AttackFilesComponent implements OnInit, OnChanges {
  @Input() notify: any;
  constructor() { }
  attachs = []
  ngOnChanges(changes: SimpleChanges): void {

    if (changes.notify && this.notify.attachs.length > 0) {
          this.attachs = [...this.notify.attachs.map(d => d.attach_url)];
      if (typeof this.attachs === 'string') {
        this.attachs= (this.attachs as string).split(',');
      }
    }
  }

  ngOnInit(): void {
    console.log(this.notify)
  }

  handleRemoveMedia(id) {
    this.attachs= (this.attachs as string[]).filter(t => t !== id);
  }

  openFile(item) {
    window.open(item.attach_url, '_blank');
  }
}
