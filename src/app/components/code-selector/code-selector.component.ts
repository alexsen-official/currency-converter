import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Code } from '../../types';

@Component({
  selector: 'app-code-selector[control]',
  templateUrl: './code-selector.component.html',
  styleUrls: ['./code-selector.component.scss']
})
export class CodeSelectorComponent {
  @Input() control!: FormControl;
  @Input() label = '';

  @Output() onChange = new EventEmitter();

  readonly codes = Object.values(Code);
}
