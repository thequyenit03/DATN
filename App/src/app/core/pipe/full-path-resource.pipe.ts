import {Pipe, PipeTransform} from '@angular/core';
import {environment} from '../../../environments/environment';

@Pipe({
  name: 'fullPathResource',
  standalone: false
})
export class FullPathResourcePipe implements PipeTransform {

  transform(path: string): string {
    return environment.hostApi + "/file/" + path;
  }
}
