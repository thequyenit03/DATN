import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AngularEditorConfig} from '@kolkov/angular-editor';
import {NzUploadFile} from 'ng-zorro-antd/upload';
import {Provider} from "../../../../core/model/provider";
import {ProviderService} from "../../../../core/service/provider.service";
import {FormHelper} from '../../../../core/util/form-helper';
import {Product} from '../../../../core/model/product';
import {Attribute} from '../../../../core/model/attribute';
import {Menu} from '../../../../core/model/menu';
import {MenuService} from '../../../../core/service/menu.service';
import {ProductService} from '../../../../core/service/product.service';
import {AttributeService} from '../../../../core/service/attribule.service';
import {ProductImage} from '../../../../core/model/product-image';
import {environment} from '../../../../../environments/environment.development';
import {ProductAttribute} from '../../../../core/model/product-attribute';
import {ProductRelated} from '../../../../core/model/product-related';
import {DataHelper} from '../../../../core/util/data-helper';
import {ShareModule} from '../../../../share.module';

@Component({
  selector: 'app-product-detail',
  imports: [ShareModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  @Input() isAddNew: boolean = true;
  @Output() onSubmit = new EventEmitter<Product>();

  menus: Menu[] = [];
  attribute: Attribute[] = [];
  allProducts: Product[] = [];
  providers: Provider[] = [];

  formData!: FormGroup;
  visible = false;
  srcImage: string = "no_img.jpg";
  fileList: NzUploadFile[] = [];

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '350px',
    minHeight: '5rem',
    placeholder: '',
    translate: 'no',
    defaultParagraphSeparator: 'p',
  };

  constructor(
    public service: ProductService,
    public menuService: MenuService,
    public attributeService: AttributeService,
    public providerService: ProviderService,
    public formBuilder: FormBuilder
  ) {
  }

  get productAttributes(): FormArray {
    return this.formData.get("productAttributes") as FormArray;
  }

  ngOnInit() {
    this.formData = this.formBuilder.group({
      id: [0],
      menuId: [0, Validators.required],
      name: ["", Validators.required],
      alias: ["", Validators.required],
      providerCode: [""],
      image: [""],
      qty: [0, Validators.required],
      index: [1],
      status: [10, Validators.required],
      price: [0, Validators.required],
      discountPrice: [0, Validators.required],
      selling: [true],
      shortDescription: [""],
      description: [""],
      productRelateds: [[]],
      productAttributes: this.formBuilder.array([])
    });
    this.getProvider();
    this.getAttribute();
  }

  getProvider() {
    this.providerService.getAll()
      .subscribe((resp: any) => {
        this.providers = resp;
      })
  }

  setForm(product: Product) {
    this.formData.reset();
    this.productAttributes.clear();
    this.fileList = [];
    this.srcImage = environment.hostApi + "/file/" + product.image;
    this.formData.patchValue(product);

    if (product && product.productImages && product.productImages.length > 0) {
      this.fileList = product.productImages.map((x: ProductImage, i: number) => {
        return {
          uid: i.toString(),
          name: i.toString(),
          status: 'done',
          url: environment.hostApi + "/file/" + x.image
        }
      })
    }

    if (product.productAttributes && product.productAttributes.length > 0) {
      product.productAttributes.forEach((x: ProductAttribute) => {
        const id = x.attributeId;
        const attr = x.value?.split(',') ?? [];
        this.productAttributes.push(
          new FormGroup({
            attributeId: new FormControl(id),
            attributes: new FormControl(attr),
          })
        );
      })
    }

    if (product.productRelateds && product.productRelateds.length > 0) {
      this.formData.patchValue({
        productRelateds: product.productRelateds.map((x: ProductRelated) => x.productRelatedId)
      });
    }

    this.getMenu();
    this.getAllProduct();
  }

  getAllProduct() {
    this.service.getAll()
      .subscribe((resp: any) => {
        this.allProducts = resp;
      })
  }

  getAttribute() {
    this.attributeService.get({})
      .subscribe((resp: any) => {
        this.attribute = resp
      })
  }

  getMenu() {
    this.menuService.getByType(['san-pham'])
      .subscribe((resp: any) => {
        this.menus = resp;
      })
  }

  changeName(e: any) {
    this.formData.patchValue({
      alias: DataHelper.unsign(e)
    })
  }

  onloadImage(src: string) {
    this.formData.get("image")?.setValue(src);
  }

  close() {
    this.visible = false;
  }

  addAttribute() {
    this.productAttributes.push(
      this.formBuilder.group({
        attributeId: null,
        attributes: []
      })
    );
  }

  deleteAttribute(index: number) {
    this.productAttributes.removeAt(index);
  }

  submit() {
    FormHelper.markAsDirty(this.formData)
    if (this.formData.invalid) {
      return;
    }

    let dataForm: Product = this.formData.getRawValue();

    if (dataForm.productAttributes) {
      dataForm.productAttributes = dataForm.productAttributes.map((x: any) => {
        return {
          attributeId: x.attributeId,
          value: x.attributes.join(',')
        } as ProductAttribute
      });
    }

    dataForm.productImages = this.fileList.map(x => {
      return {
        image: x.thumbUrl ?? (x.url?.toString().split('/').pop() ?? "")
      } as ProductImage
    });

    if (dataForm.productRelateds) {
      dataForm.productRelateds = dataForm.productRelateds.map((x: any) => {
        return {
          productRelatedId: x
        } as ProductRelated
      });
    }

    this.onSubmit.emit(dataForm);
  }

}
