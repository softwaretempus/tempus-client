import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { SkillService } from './skill.service';
import { ISkill } from './Skill';

@Component({
  selector: 'app-skill',
  templateUrl: './skill.component.html'
})
export class SkillComponent implements OnInit {

  title: string = 'Habilidades'
  errorMessage: string
  skills: ISkill[] = []
  filteredSkills: ISkill[]
  _listFilter: string = ''

  get listFilter(): string {
    return this._listFilter
  }

  set listFilter(value: string) {
    this._listFilter = value
    this.filteredSkills = this.listFilter ? this.performFilter(this.listFilter) : this.skills
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private skillService: SkillService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.getSkills()
  }

  performFilter(filterBy: string): ISkill[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.skills.filter((skill: ISkill) =>
      skill.nome.toLocaleLowerCase().indexOf(filterBy) !== -1)
  }

  async deleteSkill(skill: ISkill) {
    if (confirm(`Deseja realmente excluir a habilidade "${skill.nome}"?`)) {
      await this.skillService.deleteSkill(skill.id)
      .subscribe(
        () => { 
          this.showSuccess('Habilidade removida da base de dados.')
          this.skills.splice(skill.id, 1);
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
    this.router.navigate(['/habilidades'])
    this.getSkills()
  }

  getSkills(): void {
    this.skillService.getSkills().subscribe(
      skills => {
        this.skills = skills
        this.filteredSkills = this.skills
      },
      error => this.errorMessage = <any>error
    )
  }

  showSuccess(msg) {
    this.toastr.success(msg, 'Sucesso!');
  }

  showError(msg) {
    this.toastr.error(msg, 'Ops! Algo está errado!');
  }

}
