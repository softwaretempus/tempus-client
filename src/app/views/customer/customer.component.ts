import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { CustomerService } from './customer.service';
import { ICustomer } from './Customer';

@Component({
  templateUrl: 'customer.component.html'
})
export class CustomerComponent implements OnInit {

  title: string = 'Clientes'
  errorMessage: string
  customers: ICustomer[] = []
  filteredList: ICustomer[]
  _listFilter: string = ''

  get listFilter(): string {
    return this._listFilter
  }

  set listFilter(value: string) {
    this._listFilter = value
    this.filteredList = this.listFilter ? this.performFilter(this.listFilter) : this.customers
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.customerService.getCustomers().subscribe(
      customers => {
        this.customers = customers
        this.filteredList = this.customers
      },
      error => this.errorMessage = <any>error
    )
  }

  performFilter(filterBy: string): ICustomer[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.customers.filter((user: ICustomer) =>
      user.nome.toLocaleLowerCase().indexOf(filterBy) !== -1)
  }

  async deleteCustomer(customer: ICustomer) {
    if (confirm(`Deseja realmente excluir o cliente "${customer.nome}"?`)) {
      await this.customerService.deleteCustomer(customer.id)
        .subscribe(
          () => { 
            this.showSuccess('Cliente removido da base de dados.')
            this.customers.splice(customer.id, 1);
            this.onSaveComplete()
          },
          (error: any) =>  {
            if(error){
              this.showError(error);
            }else{
              this.showError('Algo está errado. Tente mais tarde.')
            }
          } 
        );
    }
  }

  onSaveComplete(): void {
    this.router.navigate(['/clientes'])
    this.getCustomers()
  }

  getCustomers(): void {
    this.customerService.getCustomers().subscribe(
      customers => {
        this.customers = customers
        this.filteredList = this.customers
      },
      error => this.errorMessage = <any>error
    )
  }

  showSuccess(msg) {
    this.toastr.success(msg, 'Sucesso!');
  }

  showError(msg) {
    this.toastr.error(msg, 'Erro!');
  }

}
