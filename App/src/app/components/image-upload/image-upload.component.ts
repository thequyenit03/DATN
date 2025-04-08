import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild,} from '@angular/core';
import {Constants} from '../../core/util/constants';

@Component({
  selector: 'app-image-upload',
  standalone: false,
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css'],
})
export class ImageUploadComponent implements OnInit {
  @ViewChild('inpFile', {static: false}) public inpFileElement!: ElementRef;
  @Input() base64Image: any = Constants.IMG_DEFAULT_BASE64;
  @Output() base64ImageChange = new EventEmitter<any>();

  ngOnInit(): void {
  }

  chooseFile() {
    this.inpFileElement.nativeElement.click();
  }

  fileChangeEvent(event: any): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.base64Image = reader.result
        this.base64ImageChange.emit(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  clearImage() {
    this.base64Image = null;
    this.base64ImageChange.emit(null);
  }
}
